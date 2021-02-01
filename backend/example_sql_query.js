exports.handler = async (event) => {

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
      text: 'SELECT * FROM test_table;',
  })

  const response = {
      statusCode: '200',
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(result.rows)

  };

  return response;

};