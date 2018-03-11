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

function getHistory() {
    console.log("Getting history");
    var store = getObjectStore(DB_STORE_NAME, 'readonly');
    var request = store.openCursor(null, "prev");

    request.onsuccess = function(event) {
        var cursor = event.target.result;
        
        if (cursor) {
            console.log("Current cursor: ", cursor);
            request = store.get(cursor.primaryKey);
            request.onsuccess = function(event) {
                var value = event.target.result;
                console.log(cursor.primaryKey + ": disp: " + value.display_string + ", boxes: " + value.boxes);
                alert(cursor.primaryKey + ": disp: " + value.display_string + ", boxes: " + value.boxes);

            };

            cursor.continue();
        } else {
            console.log("No more entries.");
        }
    };
}

function searchHistory(searchTerm) {
    var store = getObjectStore(DB_STORE_NAME, 'readonly');
    var index = store.index("display_string");
    var range = IDBKeyRange.bound(searchTerm, searchTerm + '\uffff');

    index.openCursor(range).onsuccess = function(event) {
        var cursor = event.target.result;
        
        if (cursor) {
            console.log("Current cursor: ", cursor);
            request = store.get(cursor.primaryKey);
            request.onsuccess = function(event) {
                var value = event.target.result;
                // console.log("value: " + value);
                console.log(cursor.primaryKey + ": disp: " + value.display_string + ", boxes: " + value.boxes);
                alert(cursor.primaryKey + ": disp: " + value.display_string + ", boxes: " + value.boxes);
            };

            cursor.continue();
        } else {
            console.log("No more entries.");
        }
    }
}

function getObjectStore(store_name, mode) {
    var tx = db.transaction(store_name, mode);
    return tx.objectStore(store_name);
}

openDb();

function hist() {
    var term = $$("#searchbox").val();
    searchHistory(term);
}