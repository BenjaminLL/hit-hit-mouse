// global variables
var timer = null;
var values = null;
var index;
var included = false;
var correct = false;
sixValues = ["Honesty", "Trust", "Respect", "Responsibility", "Fairness", "Courage"];
definitions = ["Fairness and starightforwardness of conduct", 
                        "Assured reliance on the character, ability, strength, or truth of something",
                        "An act of giving particular attention; expressions of high or special regard",
                        "Moral, legal, or mental accountability; the quality or state of being responsible",
                        "Marked by impartiality and honesty: free from self-interest, prejudice, or favoritism",
                        "Mental or moral strength to venture, persevere, and withstand danger, fear, or difficulty"];

function MouseGame() {

    this.mousesWrap = this.$('.game-content');
    this.mouses = this.$('.game-content div');
    this.defn = this.$('.definition p');
    this.gameStart = this.$('#game-start');
    this.gameTime = this.$('#game-time');
    this.gameScore = this.$('#game-score');
    this.goodScore = 100;
    this.badScore = 50;

    this.bindEvent();
}

MouseGame.prototype = {
    constructor: MouseGame,    

    /**
     * 获取元素
     * @param  {String} elem 元素的字符串标识
     * @example
     * $('div') | $('p.active')
     * @return {NodeList}      获取的元素集
     */
    $: function(elem) {
        return document.querySelectorAll(elem);
    },    

    /**
     * 获取给定范围的随机数
     * @param  {Number} from 起始
     * @param  {Number} to   结束
     * @return {Number}      随机数
     */
    getRandom: function(from, to) {
        return Math.floor(Math.random() * (to - from + 1)) + from;
    },    

    /**
     * 设置元素内容
     * @param  {HTMLElement} elem 要设置的元素
     * @param  {String} val  设置的内容
     * @return {String}      设置好的内容|元素本身的内容
     */
    text: function(elem, val) {
        if (elem.textContent) {
            return val !== undefined ? elem.textContent = val : elem.textContent;
        } else if (elem.innerText) {
            return val !== undefined ? elem.innerText = val : elem.innerText;
        }
    },    


    /* set the definition in the white box */
    setDef: function() {
        index = this.getRandom(0, 4);
        this.defn[0].textContent = definitions[index];
    },

    /* pick values from SixValues */
    pickValue: function() {
        var that = this;        

        // 定时器随机定义value个数
        clearInterval(values);
        values = setInterval(function() {            

            included = false;

            for (var i = 0, j = that.mouses.length; i < j; ++i) {
                that.mouses[i].setAttribute('clicked', '0');
                that.mouses[i].className = 'active';
                that.mouses[i].style.display = 'none';
            } 

            var numShow = that.getRandom(1, 9);

            for (var i = 0; i < numShow; i++) {
                
                var tmpIndex = that.getRandom(0, 4);
                // add the correct one
                if (!included) {
                    tmpIndex = index;
                    included = true;
                }

                // get
                var posHole = that.getRandom(0, 7);
                
                that.mouses[posHole].style.display = 'block';
                that.mouses[posHole].textContent = sixValues[tmpIndex];
            }

            if (correct) {
                that.setDef();
                correct = false;
            }


        }, 2000);
    },    

    // 打地鼠操作
    bindEvent: function() {
        var that = this;        

        // start the game
        that.gameStart[0].addEventListener('click', function() {
            that.startGame();
        }, false);        

        // 打地鼠操作
        that.mousesWrap[0].addEventListener('click', function(e) {
            e = e || window.event;
            var elem = e.target || e.srcElement;

            // 如果当前项被隐藏则不操作，多次点击只取第一次分数
            if (elem.style.display !== 'block' || elem.getAttribute('clicked') === '1') {
                return;
            }


            var valueStr = elem.textContent;
            // 扣分
            if (sixValues.indexOf(valueStr) !== index) {
                if (that.score >= that.badScore) {
                    that.score -= that.badScore;
                }
            }

            // 加分
            else {
                that.score += that.goodScore;
                correct = true;
            }            

            elem.setAttribute('clicked', '1');
            that.text(that.gameScore[0], that.score);
        }, false);
    },    

    // 倒计时，当前剩余游戏时间
    countDown: function() {
        var that = this;        

        clearInterval(timer);
        timer = setInterval(function() {
            that.text(that.gameTime[0], --that.totalTime);            

            if (that.totalTime === 0) {
                clearInterval(timer);
                timer = null;
                clearInterval(values);
                
                for (var i = 0, j = that.mouses.length; i < j; ++i) {
                    that.mouses[i].style.display = 'none';
                }
                that.text(that.defn[0], "");              

                alert('Game Over，Score：' + that.score);
            }
        }, 1000);
    },    

    // 开始游戏
    startGame: function() {
        this.score = 0;
        this.totalTime = 60;
        this.text(this.gameTime[0], this.totalTime);
        this.text(this.gameScore[0], this.score);        

        this.setDef();
        this.countDown();
        this.pickValue();
    }
};

new MouseGame();