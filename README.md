# web-data-editor
It is a web application of data editing tool.
Since it works only with HTML, JavaScript, AngularJS, it works easily with rental server etc.


## feature
* Create new csv/tsv/json data
* Editing csv/tsv/json file
  * Add/Delete row and column
  * Change to the value
  * Convert to data form
* Save and download edited csv/tsv/json data

## How to use
### Deploy
Just deploy the project to the document root of the web server such as Apache.
Installation of the library is unnecessary.

### Create new data
1. Click the link of `新規作成`
2. In the displayed Modal, select the number of rows and columns
3. Click the button of `作成`
4. A new data format is displayed on the screen


### Editing from the file
1. Click the link of `ファイルから開く`.
2. In the displayed Modal, select file format
3. Select file from the file tag on the screen
4. The data is loaded on the screen and the input form for editing is displayed

### Clear edited data
1. Click the link of `クリア`

### Save and download to edited data
1. Click the link of `保存`
2. In the displayed Modal, select file format
3. 3. Click the button of `保存`
4. you can download the contents of the file edited on the screen
