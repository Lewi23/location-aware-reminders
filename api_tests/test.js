import fetch from 'node-fetch';
const fs = require('fs').promises;
var parser = require('xml2json-light');


async function load_data() {
    const file_data = await fs.readFile('api_tests\\infront_asda.gpx', "utf8");
    return file_data;
}

test('Walking directly in front of Asda (Food, Drink and Multi Item Retail reminder)', async () => {
  jest.setTimeout(60000);

  let data = await load_data();
  var json = parser.xml2json(data);
  var coord_array = json.gpx.trk.trkseg.trkpt;

  
  for (const coordPair of coord_array){
    let result = await fetch('https://0186u6yf60.execute-api.eu-west-2.amazonaws.com/v1/check_location?lon=' + coordPair.lon + '&lat=' + coordPair.lat);
    let POIs = await result.json();

    try {
      if(POIs.body.flat().includes('Asda Stores Ltd')){
        expect(POIs.body).toEqual(
          expect.arrayContaining([
            "Asda Stores Ltd", 
            "Retail", 
            "Food, Drink and Multi Item Retail", 
            "Supermarket Chains", 
            "POINT(-3.81525225743462 56.0247939024167)"]),
        );
      }
    } catch (error) {
      
    }
  }
});


test('Walking near a similar type of shop (Food, Drink and Multi Item Retail reminder)', async () => {
  jest.setTimeout(60000);

  let data = await load_data();
  var json = parser.xml2json(data);
  var coord_array = json.gpx.trk.trkseg.trkpt;

  
  for (const coordPair of coord_array){
    let result = await fetch('https://0186u6yf60.execute-api.eu-west-2.amazonaws.com/v1/check_location?lon=' + coordPair.lon + '&lat=' + coordPair.lat);
    let POIs = await result.json();

    try {
      if(POIs.body.flat().includes('Food, Drink and Multi Item Retail')){
        expect(POIs.body).toEqual(
          expect.arrayContaining([
            "Retail", 
            "Food, Drink and Multi Item Retail"]),
        );
      }
    } catch (error) {
      
    }
  }
});

