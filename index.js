var mysql = require('mysql');

const browserObject = require('./browser');
const { scraperController } = require('./pageController');

const connectTodb = async () => {
    const db = mysql.createConnection({
        host:   'sql7.freesqldatabase.com',
        user: 'sql7588511',
        port: 3306,
        password: 'LW4uSdIraf',
        database: 'sql7588511',
        multipleStatements: true
    });
    db.connect((err) => {
        if (err){
             throw err;
        }
        console.log('mysql connected')
    })    
    return db
}


const runScraper = async () => {
    //Start the browser and create a browser instance
    let browserInstance = browserObject.startBrowser();
    // Pass the browser instance to the scraper controller
    let scrapedData = await scraperController(browserInstance)
    return scrapedData
}


const writeToDb = async (scrapedData, dbConn) => {
    const post = {
        tourTitle: scrapedData.tourTitle,
        tourPrice: scrapedData.tourPrice,
        priceguarantee: scrapedData.priceGuarantee
    }
    dbConn.query('INSERT INTO scraper SET ?', post, function (error, results, fields) {
        if (error) throw error;
    });
}

const scraper = async() => {
    let scrapedData = await runScraper()
    dbConn = await connectTodb()
    scrapedData.map(async (data, index) => {
        await writeToDb(data, dbConn)
    })
    await dbConn.end()
    console.log("Completed scraping successfully")
}
scraper()


