import io
import sqlite3
def exe():
    connection = sqlite3.connect("securitysurveillance.db")
    cursor = connection.cursor()
    query = 'alter table suspects ADD COLUMN longitude DOUBLE ;'
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
""", connection = sqlite3.connect("securitysurveillance.db")):
    cursor = connection.cursor()
    try:
        cursor.execute(query)
        result = cursor.fetchall()
        return result
    except Exception as readError:
        print(bcolors.redUnderline + f"Error:'{readError}''")

print(*read_query("PRAGMA table_info(suspects);"),sep='\n')
