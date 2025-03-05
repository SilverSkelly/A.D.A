import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import parser from 'stream-json';
// import {streamArray} from 'stream-json/streamers/StreamArray';


//set storage location and filename
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        /**
         * @param {function} cb: callback function
         */
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
      }
});


var upload = multer({storage :storage});
// const upload = multer({ storage: multer.memoryStorage() });



//Parsing JSON for LLM
async function parseLargeUProject(req, file) {
    try{
        let filePath = `${upload.storage.destination(req, file)}/${upload.storage.filename(req, file)}`;
        //Check file size
        const stats = await fs.stat(filePath);
        const fileSizeInGB = stats.size / (1024 * 1024 * 1024);

        if(fileSizeInGB > 5) {
            console.error("Error: File size exceeds 5GB Limit.");
            return;
        }
        console.log(`processing file: ${filePath} (${fileSizeInGB.toFixed(2)} GB)`);

        const stream = fs.createReadStream(filePath,{ encoding: 'utf8'});
        const jsonParser = parser();
        stream.pipe(jsonParser);

        let projectInfo = {
            "Project Name": "Unknown",
            "Engine Version":"Unknown",
            "Modules": [],
            "Plugins": []
        };

        jsonParser.on('data', ({key,value}) => {
            if (key === 'FileVersion') projectInfo["Project Name"] = value;
            if (key ==='EngineAssociation') projectInfo["Engine Version"] = value;
            if (key ==='Modules') projectInfo["Modules"] = value.map(m => m.Name);
            if (key ==='Plugins') projectInfo["Plugins"] = value.map(p => `${p.Name} (${p.Enabled ? "Enabled": "Disabled"})`);
        });

        jsonParser.on('end', () => {
            console.log("Parsed Unreal Project:", projectInfo);
            return projectInfo
        });

        jsonParser.on('error',(err) => {
            console.log("Error parsing .uproject:",err);
        });
    } catch (error){
        console.error("Error handing File:", error);
    }
}

export default { parseLargeUProject, upload};
