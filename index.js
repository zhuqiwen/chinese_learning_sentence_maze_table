function go(e) {
    const numRow = 7;
    const numCol = 10;

    const sentence = document.getElementById('sentence').value;
    const chars = document.getElementById('chars').value;
    const tableDiv = document.getElementById('myTable');
    let range = document.createRange();


    tableDiv.innerHTML = "";

    const sentenceArray = getSentenceArray(sentence);
    const randomWords = getSentenceArray(chars);
    const tableArray = createTable(sentenceArray, numRow, numCol, randomWords);

    const table = createTableFromArray(tableArray, tableDiv);

    tableDiv.appendChild(table);

    range.selectNode(tableDiv);
    window.getSelection().removeAllRanges()
    window.getSelection().addRange(range);

    document.execCommand('copy');
    console.log(range);

    alert("生成的句子迷宫经复制到剪贴板，可以粘贴到word里面坐进一步调整。建议：1，采用landscape orientation，边距为narrow；2，行高设为0.9 inch，列宽设为0.9 inch；3，board and shading设为all");



}



function getSentenceArray(sentence){
    return sentence.split('')
}

//有瑕疵：有时候句子没填完，就撞墙了，然后下一个字从别的地方冒出来。
//但是能用。如果出现上述问题，多run几次试试
function createTable(sentence, rows, cols, randomWords) {
    // Create an empty 2D array
    const table = new Array(rows).fill(null).map(() => new Array(cols).fill(null));

    // Choose a random starting cell for the first word
    let row = Math.floor(Math.random() * rows);
    let col = Math.floor(Math.random() * cols);

    // Insert the first word into the starting cell
    table[row][col] = sentence[0];

    // Keep track of the previous row and column
    let prevRow = row;
    let prevCol = col;

    // Loop through the remaining words in the sentence
    for (let i = 1; i < sentence.length; i++) {
        // Choose a random direction to move in
        let direction = Math.floor(Math.random() * 4);

        // Try to move in the chosen direction until a valid cell is found
        let count = 0;
        while (true) {
            switch (direction) {
                case 0: // Up
                    row = prevRow - 1;
                    col = prevCol;
                    break;
                case 1: // Down
                    row = prevRow + 1;
                    col = prevCol;
                    break;
                case 2: // Left
                    row = prevRow;
                    col = prevCol - 1;
                    break;
                case 3: // Right
                    row = prevRow;
                    col = prevCol + 1;
                    break;
            }

            // Check if the new cell is within the table boundaries
            if (row >= 0 && row < rows && col >= 0 && col < cols && !table[row][col]) {
                // If the cell is valid, insert the word
                table[row][col] = sentence[i];
                prevRow = row;
                prevCol = col;
                break;
            } else {
                // If the cell is invalid, try a different direction
                direction = (direction + 1) % 4;
                count++;
            }

            // If we've tried all 4 directions and haven't found a valid cell,
            // reset the search and start again from a random cell
            if (count === 4) {
                row = Math.floor(Math.random() * rows);
                col = Math.floor(Math.random() * cols);
                while (table[row][col]) {
                    row = Math.floor(Math.random() * rows);
                    col = Math.floor(Math.random() * cols);
                }
                table[row][col] = sentence[i];
                prevRow = row;
                prevCol = col;
                break;
            }
        }
    }

    // Fill the remaining cells with random words
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!table[i][j]) {
                table[i][j] = randomWords[Math.floor(Math.random() * randomWords.length)];
            }
        }
    }

    // Return the completed table
    return table;
}

function createTableFromArray(arr) {
    const table = document.createElement('table'); // Create the table element
    for (let i = 0; i < arr.length; i++) { // Loop through the rows of the 2D array
        const row = document.createElement('tr'); // Create a new row element
        for (let j = 0; j < arr[i].length; j++) { // Loop through the columns of the 2D array
            const cell = document.createElement('td'); // Create a new cell element
            const cellText = document.createTextNode(arr[i][j]); // Create a new text node with the value of the current cell
            cell.appendChild(cellText); // Add the text node to the cell
            row.appendChild(cell); // Add the cell to the current row
        }
        table.appendChild(row); // Add the row to the table
    }
    return table; // Return the table
}

