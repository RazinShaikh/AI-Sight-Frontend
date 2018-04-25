// Main database manipulation mechanism.
// Written by GRP Team 3

const DB_VERSION = 1;
const DB_NAME = 'aiSight';
const DB_STORE_NAME = 'history';

var db;

function openDb() {

    var request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onsuccess = function (event) {
        db = this.result;

        console.log("openDb DONE");

        db.onerror = function () {
            console.log(db.errorCode);
        };
    };

    request.onerror = function(event) {
        console.log("Error happened: " + event.target.errorCode);
    };

    request.onupgradeneeded = function(event) {
        db = event.target.result;

        var objectStore = db.createObjectStore(DB_STORE_NAME, {keyPath: "id", autoIncrement: true});

        objectStore.createIndex("display_string", "display_string", {unique: false, multiEntry:true});
        objectStore.createIndex("time", "time", {unique: true});
    };

}

function insertEntry(imageURL, boxes, scores, classes, display_string) {

    console.log("inserting....");
    var time = new Date();
    var data = {imageURL: imageURL, boxes: boxes, scores: scores, classes: classes, display_string: display_string, time: time};
    var store = getObjectStore(DB_STORE_NAME, 'readwrite');

    var request = store.add(data);

    request.onsuccess = function(event) {
        console.log("Insertion in DB successful");
    };

    request.onerror = function() {
        console.error("insertEntry error", this.error);
    };

}

function getHistory(searchTerm) {

    document.getElementById("historyGrid").innerHTML = "";

    var store = getObjectStore(DB_STORE_NAME, 'readonly');
    var request;
    var lastLabel;
    var lastPrimaryKey;
    var lowerTerm;

    if (searchTerm) {
        lowerTerm = searchTerm.toLowerCase();
        var index = store.index("display_string");
        var range = IDBKeyRange.bound(lowerTerm, lowerTerm + '\uffff');
        request = index.openCursor(range, "prev");
    } else {
        request = store.openCursor(null, "prev");
    }


    request.onerror = function(event) {
        console.log("Error in getting history");
    };

    request.onsuccess = function(event) {
        var cursor = event.target.result;

        if (cursor) {
            var currentPrimaryKey = cursor.primaryKey;
            var currentKey = cursor.key+'';
            currentLabel = (currentKey.split(":"))[0];
            // console.log("Current cursor: ", cursor);
            if (currentLabel == lastLabel && currentPrimaryKey == lastPrimaryKey) {
                console.log("Identical label detected, current cursor: ", cursor);
                cursor.continue();
                return;
            }
            lastLabel = currentLabel;
            lastPrimaryKey = currentPrimaryKey;
            request = store.get(cursor.primaryKey);
            request.onsuccess = function(event) {

                var value = event.target.result;
                var myJson = JSON.stringify(value);

                var newDiv = document.createElement("div");
                newDiv.className += "grid-item";
                var newImg = document.createElement("img");
                newImg.src = value.imageURL;
                newImg.id = "img" + cursor.primaryKey;
                newImg.className += "gridImg";

                if (searchTerm) {
                    newImg.onclick = function() {
                        showImageHistory(value.id, myJson, lowerTerm);
                    };
                } else {
                    newImg.onclick = function() {
                        showImageHistory(value.id, myJson);
                    };
                }

                newDiv.appendChild(newImg);

                $$("#historyGrid").append(newDiv);

            };

            cursor.continue();
        } else {
            console.log("No more entries.");
        }
    };
}

function getObjectStore(store_name, mode) {
    var tx = db.transaction(store_name, mode);
    return tx.objectStore(store_name);
}

function deleteHistory() {
    console.log("HI");
    if (confirm("Delete all?")) {
        db.close();
        var request = window.indexedDB.deleteDatabase(DB_NAME);
        
        request.onerror = function(event) {
            alert("Deletion failed");
        };

        request.onsuccess = function(event) {
            alert("History cleared");
            openDb();
            document.getElementById("historyGrid").innerHTML = "";
        };

        request.onblocked = function () {
            console.log("Couldn't delete database due to the operation being blocked");
        };
    }
}

openDb();
