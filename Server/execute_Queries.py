import io
import sqlite3


def exe(query='alter table suspects ADD COLUMN longitude DOUBLE ;'):
    connection = sqlite3.connect("securitysurveillance.db")
    cursor = connection.cursor()
    # query = 'DESCRIBE suspects'
    try:
        cursor.execute(query)
        connection.commit()
        print("Query executed successfully")
    except Exception as err:
        print(f"Error:'{err}'")


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
    redUnderline = '\033[4m\033[91'


# exe()

def read_query(query="""Select *from officers;
""", connection=sqlite3.connect("securitysurveillance.db")):
    cursor = connection.cursor()
    try:
        cursor.execute(query)
        result = cursor.fetchall()
        return result
    except Exception as readError:
        print(bcolors.redUnderline + f"Error:'{readError}''")


# Describe the table
# print(*read_query("PRAGMA table_info(suspects);"),sep='\n')


import sqlite3
import bcrypt




def hashPassword(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password

def changePasswordToSecure():
    query = "Select id,password from officers"
    users = read_query(query)
    print(users)
    # for user in users:
    #     userId, userPassword = user
    #     changeQuery = f'update officers set password="{hashPassword(userPassword)}" where id={userId}'
    #     print(exe(changeQuery))
# changePasswordToSecure()


def verifyPassword(stored_password, provided_password):
    return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password)

password = "mani#2003"
hashed_password = hashPassword(password)

print(type(hashed_password))
if verifyPassword(hashed_password, 'mani#12003'):
    print("Password is correct")
else:
    print("Password is incorrect")
