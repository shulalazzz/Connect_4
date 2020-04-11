//connect_4 class with all variables and methods
class connect_4 {
    constructor(selector) {
        this.row = 6
        this.col = 7
        this.selector = selector
        this.turn = 0
        this.game_over = false
        this.drop_btn()
        this.create_board()
        this.event_listeners()
        this.restart()
    }
    //an confirm message box will pop up, choice ok to restart and play again
    restart() {
        $('#player_turn').text('Red')
        const $board = $(this.selector)
        $board.empty()
        this.drop_btn()
        this.create_board()
        this.turn = 0
        this.game_over = false
    }
    // 7 drop buttons on the top of the board
    drop_btn() {
        const $drop_btn = $(this.selector)
        for (let i = 0; i < this.col; i++) {
            let $btn = $('<button>Drop</button>').addClass('drop_btn').attr('num', i)
            $drop_btn.append($btn)
        }
    }
    // create a 6*7 board. initially, all cells have a empty class indicate they are not occupied or color is white
    create_board() {
        console.log("creating board")
        const $board = $(this.selector)
        for (let i = 0; i < this.row; i++) {
            let $row = $('<div>').addClass('row')
            for (let j = 0; j < this.col; j++) {
                let $col = $('<div>').addClass('col empty').attr('row', i).attr('col', j)
                $row.append($col)
            }
            $board.append($row)
        }
    }



    event_listeners() {
        let that = this
        console.log('this is', this)
        //find the lowest empty cell with given col
        function find_empty(thecol) {
            //console.log('col pass in is', thecol)
            let cell_list = $(`.col[col='${thecol}']`)
            //console.log(cell_list)
            for (let i = cell_list.length - 1; i > -1; i--) {
                let $empty_cell = $(cell_list[i])
                //console.log($empty_cell, 'is the empty cell')
                if ($empty_cell.hasClass('empty')) {
                    return $empty_cell
                }
            }
            return null
        }
        // when user clicks a drop button, the lowest empty cell will be colored 
        //even turn number for red player, odd turn number for blue player
        function drop_down(thecol) {
            let $the_cell = find_empty(thecol)
            if ($the_cell) {
                $the_cell.removeClass('empty')
                if (that.turn % 2 == 0) {
                    $the_cell.css('backgroundColor', 'red')
                    $('#player_turn').text('Blue')
                    that.turn += 1
                    return $the_cell
                }
                else {
                    $the_cell.css('backgroundColor', 'blue')
                    $('#player_turn').text('Red')
                    that.turn += 1
                    return $the_cell
                }
            }
            return null
        }
        const $board = $(this.selector)
        // on mouse enter, show the user the potential position of a piece
        $board.on('mouseenter', '.drop_btn', function () {
            let col = $(this).attr('num')
            console.log(this)
            let $cell = find_empty(col)
            if ($cell != null) {
                if (that.turn % 2 == 0) {
                    $cell.css('backgroundColor', 'rgba(255,0,0,0.6)')
                }
                else {
                    $cell.css('backgroundColor', 'rgba(0,0,255,0.6)')
                }
            }

        })
        //on mouse leave, that cell goes back to white
        $board.on('mouseleave', '.drop_btn', function () {
            let col = $(this).attr('num')
            let $cell = find_empty(col)
            if ($cell != null) {
                $cell.css('backgroundColor', 'white')
            }
        })
        // on click, check win
        $board.on('click', '.drop_btn', function () {
            let col = $(this).attr('num')
            let $last_cell = drop_down(col)
            let is_win = that.check_win($last_cell)
            if (is_win) {
                if (that.turn % 2 == 1) {
                    if (confirm('Player red win! Play again?'))
                        that.restart()
                }
                else {
                    if (confirm('Player Blue win! Play again?'))
                        that.restart()
                }

            }
        })
    }
    // once a user drop a piece, based on this piece, check 8 direction to find out if the user win the game
    check_win(last_move) {
        let that = this
        console.log('this is in check win', this)
        let $last_cell = last_move
        if ($last_cell) {
            let row = $last_cell.attr('row')
            let col = $last_cell.attr('col')
            let color = $last_cell.css('backgroundColor')
            return (check_horizontal(row, col, color) ||
                check_vertical(row, col, color) ||
                check_top_left_bottom_right(row, col, color) ||
                check_top_right_bottom_left(row, col, color))
        }
        // get the cell with given row and col
        function get_cell(row, col) {
            return $(`.col[row='${row}'][col='${col}']`)
        }
        //check horizontal direction of this piece, if there is another piece with same color, count++
        //check left and right, break the loop if the piece next to it has a different color
        //if count >=3 which mean plus the last dropped piece, we have 4 pieces with same color, this is a win
        function check_horizontal(row, col, color) {
            let count = 1
            let temp = col
            while (col > 0) {
                let $left_cell = get_cell(row, --col)
                console.log(col, color, 'left count')
                console.log($left_cell)
                if ($left_cell.css('backgroundColor') == color) {
                    count += 1
                    console.log('count +++ left')
                }
                else {
                    break
                }
            }
            col = temp
            while (col < that.col) {
                let $right_cell = get_cell(row, ++col)
                console.log(col, color, 'right count')
                console.log($right_cell)
                if ($right_cell.css('backgroundColor') == color) {
                    count += 1
                    console.log('count +++ right')
                }
                else {
                    break
                }
            }
            if (count >= 4) {
                return true
            }
            return false
        }
        //check vertical direction of this piece
        function check_vertical(row, col, color) {
            let count = 1
            let temp = row
            while (row > 0) {
                let $down_cell = get_cell(--row, col)
                if ($down_cell.css('backgroundColor') == color) {
                    count += 1
                    console.log('count +++ down')
                }
                else {
                    break
                }
            }
            row = temp
            while (row < that.row) {
                let $up_cell = get_cell(++row, col)
                if ($up_cell.css('backgroundColor') == color) {
                    count += 1
                    console.log('count +++ right')
                }
                else {
                    break
                }
            }
            if (count >= 4) {
                return true
            }
            return false
        }
        //check top left to bottom right direction of this piece
        function check_top_left_bottom_right(row, col, color) {
            let count = 1
            let temp_row = row
            let temp_col = col
            while (row > 0 && col > 0) {
                let $next_cell = get_cell(--row, --col)
                if ($next_cell.css('backgroundColor') == color) {
                    count += 1
                }
                else {
                    break
                }
            }
            row = temp_row
            col = temp_col
            while (row < that.row && col < that.col) {
                let $up_cell = get_cell(++row, ++col)
                if ($up_cell.css('backgroundColor') == color) {
                    count += 1
                }
                else {
                    break
                }
            }
            if (count >= 4) {
                return true
            }
            return false
        }
        //check top right to bottom left direction of this piece
        function check_top_right_bottom_left(row, col, color) {
            let count = 1
            let temp_row = row
            let temp_col = col
            while (row < that.row && col > 0) {
                let $next_cell = get_cell(++row, --col)
                if ($next_cell.css('backgroundColor') == color) {
                    count += 1
                }
                else {
                    break
                }
            }
            row = temp_row
            col = temp_col
            while (row > 0 && col < that.col) {
                let $up_cell = get_cell(--row, ++col)
                if ($up_cell.css('backgroundColor') == color) {
                    count += 1
                }
                else {
                    break
                }
            }
            if (count >= 4) {
                return true
            }
            return false
        }
    }

}