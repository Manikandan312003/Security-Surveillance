from flask import Flask, jsonify
import sqlite3
from flask_cors import CORS
import base64

app = Flask(__name__)
CORS(app)
@app.route('/get_suspects', methods=['GET'])
def get_suspects():
    conn = sqlite3.connect('securitysurveillance.db')  # Replace with the correct path to your SQLite database file.
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM suspects")
    suspects_data = cursor.fetchall()
    conn.close()

    if suspects_data:
        suspects_with_base64_images = []
        # cnt=0
        for suspect in suspects_data:
            # Convert the image data in the second position of the tuple to base64
            if suspect[1]:  # Assuming the image data is in the second position
                base64_image = base64.b64encode(suspect[1])
                print(base64_image)
                base64_image = base64_image.decode('utf-8')
                print(base64_image)
                suspect_with_base64_image = (suspect[0], base64_image)  # Assuming the first position is an identifier
                suspects_with_base64_images.append(suspect_with_base64_image)
                print(type(base64_image))
            #     with open("image1"+str(cnt)+".jpeg",'wb') as img:
            #         img.write(suspect[1])
            # cnt+=1

        return jsonify(suspects=suspects_with_base64_images)
    else:
        return jsonify('No suspects found', 404)

app.run(debug=True)
