import base64
import json
import main
def writetofile(dataFormat):
    with open('securitysurveillance.json','w') as file:
        # dataFormat={2:[['Elon','None',base64.b64encode(main.convertToBinaryData('image1.jpeg')).decode('utf-8')],
        #                ['Salem',11.664325,78.146011]
        #             ]}
        json.dump(dataFormat,file,indent=4)

# writetofile()
deta = main.load_data()
deta[1]=[['Elon','None',base64.b64encode(main.convertToBinaryData('image1.jpeg')).decode('utf-8')],
                       ['Salem',11.664325,78.146011]]
# writetofile(deta)
# print(main.load_data())
"""print({'id':1}.get('id',0))

method1={id:{'locationDetails':[{
                          'location':'Salem',
                          'latitude':1234.5432,
                          'longitude':15423.321,
                      }],
                      'suspectName':'Elon',
                      'suspectReason':'None',
                      'suspectPhoto':base64.b64encode(main.convertToBinaryData('image1.jpeg')).decode('utf-8')
                      }}

method2={'id':2,
                      'locationDetails':[{
                          'location':'Salem',
                          'latitude':1234.5432,
                          'longitude':15423.321,
                      }],
                      'suspectName':'Elon',
                      'suspectReason':'None',
                      'suspectPhoto':base64.b64encode(main.convertToBinaryData('image1.jpeg')).decode('utf-8')
                      }
method3={'id':[['suspectName','suspectReason','suspectPhoto'],
               ['location','latitude','longitude']
               ]}

dataFormat1 = {'id':2,
                      'locationDetails':[{
                          'location':'Salem',
                          'latitude':1234.5432,
                          'longitude':15423.321,
                      }],
                      'suspectName':'Elon',
                      'suspectReason':'None',
                      'suspectPhoto':base64.b64encode(main.convertToBinaryData('image1.jpeg')).decode('utf-8')
                      }
"""

# import main
# print(main.load_data())

import datetime
print(datetime.date.today())

"""
[[ '12.05.2023','Salem','Latitude','Longitude','map' ],
            ['12.05.2023','Salem','Latitude','Longitude','map' ],
            ['12.05.2023','Salem','Latitude','Longitude','map' ],
            ['12.05.2023','Salem','Latitude','Longitude','map' ],
            ['12.05.2023','Salem','Latitude','Longitude','map' ],
            ['12.05.2023','Salem','Latitude','Longitude','map' ],
            ['12.05.2023','Salem','Latitude','Longitude','map' ],
            ['12.05.2023','Salem','Latitude','Longitude','map' ],
        ['12.05.2023','Salem','Latitude','Longitude','map' ],
        ['12.05.2023','Salem','Latitude','Longitude','map' ]]"""
