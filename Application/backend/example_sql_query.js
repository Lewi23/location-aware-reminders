exports.handler = async (event) => {
    
    const lon = event['params']['querystring']['lon'];
    const lat = event['params']['querystring']['lat'];
    const search_range =event['params']['querystring']['search_range'];

    const {
        Client
    } = require('pg')

    const client = new Client({
        user: process.env.USER,
        host: process.env.HOST,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
        port: 5432,
    })

    client.connect()

    const result = await client.query({
        rowMode: 'array',
        text: 'SELECT\
                  poi_table.name,\
                  poi_table.groupname,\
                  poi_table.categoryname,\
                  poi_table.classname,\
                  ST_AsText(poi_table.geomwgs84)\
               FROM\
                  osmm_buildings\
                  JOIN poi_building_lookup ON osmm_buildings.id=poi_building_lookup.buildingid\
                  JOIN poi_table ON poi_building_lookup.poiid=poi_table.id\
               WHERE \
                  ST_DWithin(osmm_buildings.geom, ST_TRANSFORM(ST_SETSRID(ST_MAKEPOINT (' + lon + ',' +  lat + '),4326),27700), ' + search_range + ') 
                  OR
                  ST_DWithin(poi_table.geom, ST_TRANSFORM(ST_SETSRID(ST_MAKEPOINT (' + lon + ',' +  lat + '),4326),27700), ' + search_range + ')
                  '
    })
    
    

    const response = {
        statusCode: '200',
        headers: {
            "Content-Type": "application/json"
        },
        body: result.rows
        //body: JSON.stringify(result.rows,null, 2)
    };


    //return lon + "," + lat;
    return response;

};
