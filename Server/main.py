# flask Operations
import io
import json
from flask import Flask
from flask import request, jsonify, send_file
from flask_cors import CORS
import base64

app = Flask(__name__)
CORS(app)

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


def execute_query(query, connection=makeConnection(), datatuples=()):
    cursor = connection.cursor()
    try:
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


#Login and Password
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

        originalPassword = bytes(originalPassword[2:-1],'utf-8')
        if verifyPassword(originalPassword,password):
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
        location = request.args.get("location","")
        latitude = request.args.get("latitude","")
        longitude = request.args.get("longitude","")

        editQuery = f'Update suspects set name="{name}",reason="{reason}",location ="{location}",latitude="{latitude}",longitude="{longitude}" where id="{suspectId}" and userid="{userId}";'
        execute_query(editQuery, connection=makeConnection())
        return jsonify({'status': 'success'})

    except Exception as err:
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


@app.route('/getallsuspect')
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


@app.route('/getsuspectdetails',methods=['GET'])
def getsuspectDetails():
    suspectId = request.args.get('suspectid',0)
    if suspectId==0:
        return jsonify({'status:invalid','suspectdetails'})
    try:

        return jsonify({
            'status':'success',
            'suspectdetails':[[ '12.05.2023','Salem','Latitude','Longitude','map' ],
            ['12.05.2023','Salem','Latitude','Longitude','map' ],
            ['12.05.2023','Salem','Latitude','Longitude','map' ],
            ['12.05.2023','Salem','Latitude','Longitude','map' ],
            ['12.05.2023','Salem','Latitude','Longitude','map' ],
            ['12.05.2023','Salem','Latitude','Longitude','map' ],
            ['12.05.2023','Salem','Latitude','Longitude','map' ],
            ['12.05.2023','Salem','Latitude','Longitude','map' ],
        ['12.05.2023','Salem','Latitude','Longitude','map' ],
        ['12.05.2023','Salem','Latitude','Longitude','map' ]]
        })
    except:
        pass

@app.route('/getdatabase',methods=['GET'])
def getDataBase():
    pass

if __name__ == '__main__':
    app.run(debug=True)
