**Steps for Local setup**

1. Open vs code
2. Open Terminal and cd to project directory where you store all your projects
3. Create new folder for root directory
```
mkdir billwhiz
```

4. Enter root directory
```
cd billwhiz
```

5. Clone project in your local by running
```
git clone https://github.com/dishavarshney29/bill-whiz.git
```

6. Run Mongo on terminal at Port 27017 using command 
```
mongod (for windows) 

7. Unpack mongo db data dump 
```
unzip your_database_dump.zip
mongorestore --uri="mongodb://remote_host:remote_port/remote_database_name" /path/to/your/dump/directory/your_database_name
```
***Note: For updating mongodb data dump***
Create a mongo db data dump from your local mongo db
mongodump --uri="mongodb://localhost:27017/billwhiz" --out=C:/Users/HP NOTEBOOK/DishaVarshney/Projects/plotline

```
mongodump --uri="mongodb://localhost:27017/your_database_name" --out=/path/to/your/dump/directory
```
Zip the data dump if it's bigger in size
```
zip -r your_database_dump.zip /path/to/your/dump/directory/your_database_name
```
Share via email etc. to remote user

8. Run application in vscode on project root directory
```
node src/app.js
```