# flask Operations
import io
import json
from flask import Flask
from flask import request, jsonify, send_file
from flask_cors import CORS
import base64
import datetime

app = Flask(__name__)
CORS(app)

from flask_socketio import SocketIO
socketio = SocketIO(app, cors_allowed_origins='*')

# SQL Operations
import sqlite3
import pandas as pd
from IPython.display import display

connection = sqlite3.connect("securitysurveillance.db")


class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    redUnderline = '\033[4m\033[91m'


def makeConnection():
    return sqlite3.connect("securitysurveillance.db")


def execute_query(query, connection=None, datatuples=()):
    cursor = None
    try:
        if connection==None :
            connection = makeConnection()
            cursor = connection.cursor()
        cursor.execute(query, datatuples)
        connection.commit()
        connection.close()
        return ("Query executed successfully")
    except Exception as err:
        print(bcolors.redUnderline + f"Error:'{err}'")


# def executeQuery

# Display
def read_query(query="""Select *from officers;
""", connection=connection):
    cursor = connection.cursor()
    try:
        cursor.execute(query)
        result = cursor.fetchall()
        return result
    except Exception as readError:
        print(bcolors.redUnderline + f"Error:'{readError}''")

def readWithColoumn(query='Select *from suspects;'):
    try:
        connection = makeConnection()
        connection.row_factory = sqlite3.Row
        cursor = connection.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()
        rows = [dict(row) for row in rows]
        connection.close()
        return rows
    except Exception as readException:
        return str(readException)


def displayQuery(query="""Select *from officers;
""", connection=connection, columns=("id", "name", "password", "phonenumber", "emailid", "address")):
    outputlist = read_query(query, connection)
    output = []
    for out in outputlist:
        output.append(list(out))
    df = pd.DataFrame(output, columns=columns)
    display(df)


# SQL officers details
createTableofUser = """Create Table officers(
id INTEGER PRIMARY KEY AUTOINCREMENT ,
name varchar(255) Not Null,
password varchar(255) Not Null,
phoneNumber varchar(10) Not Null,
emailId varchar(255) Not Null,
address varchar(255) Not Null)
"""

# insertUserDetails = """Insert into officers(name,password,phoneNumber,emailId,address) values("Madhavan H","maddy","+918667517648","maddyh271101@gmail.com","Salem"),("Manikandan R","mani","+919698676607","manirajendran31jul@gmail.com","Salem");"""
# execute_query(insertUserDetails)

createTableofSuspect = """
Create Table suspects(
id INTEGER PRIMARY KEY AUTOINCREMENT ,
image BLOB Not Null,
name varchar(255) Not Null,
reason varchar(255) Not Null,
userid INTEGER Not Null);
"""

# execute_query(createTableofSuspect,connection)


# For client


# Login and Password
import bcrypt


def hashPassword(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password


def verifyPassword(stored_password, provided_password):
    return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password)


@app.route('/check', methods=['GET'])
def checkPassword():
    try:
        connection = makeConnection()
        useremail = request.args.get('useremail', '')
        password = request.args.get('password', '')
        getPasswordQuery = 'select password,name,id from officers where emailId="' + useremail + '";'
    except:
        return jsonify({"status", "invalid"})
    try:
        res = read_query(query=getPasswordQuery, connection=connection)
        if res:
            originalPassword, userName, userid = res[0]
        else:
            return jsonify({"status": "User Not Exist"})

        originalPassword = bytes(originalPassword[2:-1], 'utf-8')
        if verifyPassword(originalPassword, password):
            return jsonify({"status": "success", "username": userName, "useremail": useremail, "userid": userid})
        else:
            return jsonify({"status": "Wrong Password"})
    except Exception as e:
        print(e)
        return jsonify({'status': 'User Not Exist'})


# Handling Suspect Images

# Insert suspect to DataBase
@app.route('/uploadsuspect', methods=["GET", "POST"])
def uploadSuspect():
    if request.method == "GET":
        return jsonify({"status": "invalid"})

    files = request.files
    if files is None or "suspect" not in files:
        return jsonify({"status": "No file exist"})
    else:
        details = request.form
        suspectImage = files["suspect"].stream.read()
        name = details.get("name", default="Not Mentioned")
        reason = details.get("reason", default="Not Mentioned")
        userid = details.get("userid", 0)
        if userid == 0:
            return jsonify("status", "Need userid")
        uploadSuspectQuery = f"""insert into suspects(image,name,reason,userid)
                            values(?,?,?,?);"""
        execute_query(uploadSuspectQuery, connection=makeConnection(),
                      datatuples=(suspectImage, name, reason, userid))

        return jsonify({"status": "success"})


# Delete suspect
@app.route('/deletesuspect')
def deleteSuspect():
    try:
        suspectId = request.args.get('suspectid', 0)
        if suspectId == 0: return jsonify({"status": "required suspect id"})
        userId = request.args.get('userid', 0)
        if userId == 0: return jsonify({"status": "required user id"})
        deleteSuspectDetails(suspectId)
        deleteQuery = f'delete from suspects where id={suspectId} and userid={userId}'
        (execute_query(deleteQuery, connection=makeConnection()))
        return jsonify({"status": "success"})
    except Exception as err:
        return jsonify({"status": "err", "err": str(err)})


@app.route('/editsuspect')
def editSuspect():
    try:
        suspectId = request.args.get('suspectid', 0)
        if suspectId == 0: return jsonify({"status": "required suspect id"})
        userId = request.args.get('userid', 0)
        if userId == 0: return jsonify({"status": "required user id"})
        name = request.args.get("name", "Not Mentioned")
        reason = request.args.get("reason", "Not Mentioned")
        location = request.args.get("location", "")
        latitude = request.args.get("latitude", "")
        longitude = request.args.get("longitude", "")

        query = f'select location,latitude,longitude from suspects where id={suspectId}'
        details = read_query(query, makeConnection())
        if details:
            newData = (location, latitude, longitude)
            if newData != details[0]:
                print(details[0], location, latitude, longitude)
                addSuspectDetails(suspectId, *newData)

        editQuery = f'Update suspects set name="{name}",reason="{reason}",location ="{location}",latitude="{latitude}",longitude="{longitude}" where id="{suspectId}" and userid="{userId}";'
        execute_query(editQuery, connection=makeConnection())
        return jsonify({'status': 'success'})

    except Exception as err:
        print(err)
        return jsonify({"status": "err", "err": str(err)})


def convertToBinaryData(filename):
    with open(filename, 'rb') as file:
        blobData = file.read()
    return blobData


# Get all suspect Info
def convertTobase64(query):
    suspects = []
    suspectTuple = read_query(query, connection=makeConnection())
    for suspect in suspectTuple:
        base64CImage = base64.b64encode(suspect[1]).decode('utf-8')
        suspects.append([suspect[0], base64CImage, *suspect[2:]])
    return suspects


@app.route('/getallsuspect',methods = ['Get'])
def getAllsuspect():
    try:
        getAllsuspectQuery = "Select * from suspects"
        suspects = convertTobase64(getAllsuspectQuery)
        return jsonify({"status": "success", "suspects": suspects})
    except Exception as allSuspectExp:
        return jsonify({"status": "fail", "err": str(allSuspectExp)})


@app.route('/getmysuspect', methods=['GET'])
def getMySuspect():
    userId = request.args.get('userid', 0)
    if userId == 0:
        return jsonify({'status': 'invalid'})
    try:
        getMySuspectQuery = f"Select * from suspects where userid={userId}"
        suspects = convertTobase64(getMySuspectQuery)
        # print(*suspects,sep='\n')
        return jsonify({"status": "success", "suspects": suspects})
    except Exception as mysuspectError:
        return jsonify({"status": "fail", "err": str(mysuspectError)})


# GET Suspect Details
def load_data():
    with open('securitysurveillance.json', 'r') as file:
        data = json.load(file)
    return data


def save_data(data):
    with open('securitysurveillance.json', 'w') as file:
        json.dump(data, file, indent=4)


def checkId(id):
    suspectDetails = load_data()
    for suspect in suspectDetails:
        if id == suspect['id']:
            return True
    return False


def addSuspectDetails(id, location, latitude, longitude):
    try:
        locDet = [str(datetime.date.today()), location, latitude, longitude]
        suspectDetails = load_data()
        if id in suspectDetails:
            suspectDetails[id].insert(1, locDet)
            save_data(suspectDetails)
            return True
        else:
            userDet = convertTobase64(f'select name,image,reason from suspects where id={id}')[0]
            suspectDetails[id] = [[userDet[0], userDet[2], userDet[1]],
                                  locDet]
            save_data(suspectDetails)
            return True
    except Exception as addException:
        print('Err', addException)
        return False


def deleteSuspectDetails(id):
    suspectDetails = load_data()
    if id in suspectDetails:
        del suspectDetails[id]
        save_data(suspectDetails)
        return True
    return False


@app.route('/getsuspectdetails', methods=['GET'])
def getsuspectDetails():
    suspectId = request.args.get('suspectid', 0)
    if suspectId == 0:
        return jsonify({'status:invalid', 'suspectdetails'})
    try:
        suspectDetail = load_data().get(suspectId, 0)
        if suspectDetail:
            return jsonify({'status': 'success', 'suspectdetails': suspectDetail})
        return jsonify({
            'status': 'no history',
            'suspectdetails': ''
        })
    except:
        pass


@app.route('/getdatabase', methods=['GET'])
def getDataBase():
    pass



#GSM

nodeMcuConnects = set()



@socketio.on('connect', namespace='/nodemcu')
def onNodeMcuConnect():
    print('nodeMCU Connected')
    nodeMcuConnects.add(request.sid)
    infos = readWithColoumn('select * from informtogsm')
    if infos:
        for info in infos:
            socketio.emit('nodemcuget', info, namespace='/nodemcu')
    execute_query('delete from informtogsm')


@socketio.on('disconnect', namespace='/nodemcu')
def onNodeMcuDisConnect():
    nodeMcuConnects.remove(request.sid)
    print('Node Disconnected')


@socketio.on('sendtonodemcu')
def nodemcu(data):
    print(data)
    if nodeMcuConnects != set():
        socketio.emit('nodemcuget', data,namespace='/nodemcu')
        print('nodemcu')
    else:
        query = f'''INSERT INTO informtogsm ( suspectName, contactNumber, location, category)
VALUES (?, ?, ?, ?);'''
        execute_query(query=query,datatuples=(data.get('name'), data.get('number'), data.get('location'), data.get('category')))
        print(query, 'no nodemcu found')

@app.route('/infogsm',methods=['POST'])
def infoGsm():
    nodemcu(request.form)

@app.route('/',methods=['GET'])
def index():
    return jsonify({'Hi','Hi'})

if __name__ == '__main__':
    app.run(debug=True)
    # socketio.run(app, debug=True, allow_unsafe_werkzeug=True)
