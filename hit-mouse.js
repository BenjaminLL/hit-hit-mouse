// gloable variables for the game context
var NAME, START, END, SCORE, TIME, ENDING_MESSAGE, START_MESSAGE, INSTRUCTION;
var INSTRUCTION_MESSAGES = [];
var NUM_VALUES = 6;

var sixValues = ["honesty", "trust", "respect", "responsibility", "fairness", "courage"];
var definitions = ["honestyd", "trustd", "respectd", "responsibilityd", "fairnessd", "couraged"];




// load xml based one the specified language
function parseXML(){  
              
            if (window.XMLHttpRequest) {
                // code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            } else {
                // code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } 
            
            // get the lan attribute
            var lan = document.getElementsByTagName('html')[0].getAttribute('lang');
            
            // load xml
            if (lan == "en") {

                console.log("English version picked");
                xmlhttp.open("GET","language/game1_en.xml",false);
            } else if (lan == "fr") {

                console.log("French version picked");
                xmlhttp.open("GET","language/game1_fr.xml",false);
            } else if (lan == "zh") {

                console.log("Chinese version picked");
                xmlhttp.open("GET","language/game1_zh.xml",false);
            } else {
                console.log("no language picked");
                xmlhttp.open("GET","language/game1_en.xml",false);
            }

            xmlhttp.send();
            xmlDoc = xmlhttp.responseXML;


            // set Text
            NAME = xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
            START = xmlDoc.getElementsByTagName("start")[0].childNodes[0].nodeValue;
            END = xmlDoc.getElementsByTagName("stop")[0].childNodes[0].nodeValue;
            SCORE = xmlDoc.getElementsByTagName("score")[0].childNodes[0].nodeValue;
            TIME = xmlDoc.getElementsByTagName("time")[0].childNodes[0].nodeValue;
            INSTRUCTION = xmlDoc.getElementsByTagName("instruction")[0].childNodes[0].nodeValue;
            ENDING_MESSAGE = xmlDoc.getElementsByTagName("end_message")[0].childNodes[0].nodeValue;
            START_MESSAGE = xmlDoc.getElementsByTagName("start_message")[0].childNodes[0].nodeValue;

            var SIX_VALUES = xmlDoc.getElementsByTagName("six_values")[0];
            for (var i = 0; i < NUM_VALUES; ++i) {
                sixValues[i] = SIX_VALUES.getElementsByTagName(sixValues[i])[0].childNodes[0].nodeValue;
            }

            var SIX_DEFINITIONS = xmlDoc.getElementsByTagName("six_definitions")[0];
            for (var i = 0; i < NUM_VALUES; ++i) {
                definitions[i] = SIX_DEFINITIONS.getElementsByTagName(definitions[i])[0].childNodes[0].nodeValue;
            }

            var INSTRUCTION_MESSAGE = xmlDoc.getElementsByTagName("instruction_message")[0];
            INSTRUCTION_MESSAGES[0] = INSTRUCTION_MESSAGE.getElementsByTagName("first_sentence")[0].childNodes[0].nodeValue;
            INSTRUCTION_MESSAGES[1] = INSTRUCTION_MESSAGE.getElementsByTagName("second_sentence")[0].childNodes[0].nodeValue;
            INSTRUCTION_MESSAGES[2] = INSTRUCTION_MESSAGE.getElementsByTagName("last_sentence")[0].childNodes[0].nodeValue;

}

// Set text
function setText() {

    var inst = document.querySelectorAll("#instruction")[0];
    var gameName = document.querySelectorAll("#name")[0];
    var start = document.querySelectorAll("#game-start")[0];
    var score = document.querySelectorAll("#score")[0];
    var time = document.querySelectorAll("#time")[0];
    var sm = document.querySelectorAll("#defn")[0];
    var instruction_message = document.querySelectorAll("#instruction_message")[0];

    gameName.textContent = NAME;
    inst.textContent = INSTRUCTION;
    start.textContent = START;
    score.textContent = SCORE;
    time.textContent = TIME;
    sm.textContent = START_MESSAGE;
    instruction_message.innerHTML = INSTRUCTION_MESSAGES[0] + "<br><br>" + INSTRUCTION_MESSAGES[1] + "<br><br>" +INSTRUCTION_MESSAGES[2];

}

parseXML();
setText();




// global variables
var timer = null;
var values = null;
var index;
var numBox = 9;
var included = false;
var correct = false;
var finished = true;


var body = document.getElementsByTagName("BODY")[0];
var backGround = document.querySelectorAll("#pop_background")[0];
var instructionPopup = document.querySelectorAll("#instruction_popup")[0];

/* hide instruction */
body.addEventListener("click", function() {

    backGround.style.display = 'none';
    instructionPopup.style.display = 'none';
});

function disablePopup() {
    backGround.style.display = 'none';
    instructionPopup.style.display = 'none';
}


/* play the game */
function MouseGame() {

    this.mousesWrap = this.$('.game-content');
    this.mouses = this.$('.game-content div');
    this.defn = this.$('.definition p');
    this.gameStart = this.$('#game-start');
    this.gameTime = this.$('#game-time');
    this.gameScore = this.$('#game-score');
    this.goodScore = 100;
    this.badScore = 50;
    // this.backGround = this.$("#pop_background");
    // this.instructionPopup = this.$("#instruction_popup");

    // this.instruction();
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

    setVal: function() {

        var that = this; 

        if (correct) {
            that.setDef();
            correct = false;
        }

        for (var i = 0, j = that.mouses.length; i < j; ++i) {
            that.mouses[i].setAttribute('clicked', '0');
            that.mouses[i].style.display = 'none';
            that.mouses[i].style.color = "black";
        } 

        // set the position of the right value
        var crrPos = [];
        crrPos[0] = that.getRandom(0, 7);
        crrPos[1] = that.getRandom(0, 7);
        while (crrPos[0] == crrPos[1]) {
            crrPos[1] = that.getRandom(0, 7);
        }

        for (var i = 0; i < numBox; i++) {
            
            var tmpIndex = that.getRandom(0, 4);

            // only two correct values are showed each time
            if (i == crrPos[0] || i == crrPos[1]) {
                tmpIndex = index;
            } else {
                while (tmpIndex == index) {
                    tmpIndex = that.getRandom(0, 4);
                }
            }

            that.mouses[i].style.display = 'block';
            that.mouses[i].textContent = sixValues[tmpIndex];
        }
    },

    /* pick values from SixValues */
    pickValue: function() {
        var that = this;        

        // 定时器随机定义value个数
        clearInterval(values);
        values = setInterval(function() {            

            that.setVal();

        }, 7000);
    },    

    // 打地鼠操作
    bindEvent: function() {
        var that = this;        

        // start the game
        that.gameStart[0].addEventListener('click', function() {

            if (finished) {
                that.startGame();
            } else {
                that.newGame();
            }
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
                elem.style.color = "red";
            }

            // 加分
            else {
                that.score += that.goodScore;
                correct = true;
                elem.style.color = "rgb(254,215,74)";
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

            if (that.totalTime <= 0) {
                clearInterval(timer);
                timer = null;
                clearInterval(values);
                
                for (var i = 0, j = that.mouses.length; i < j; ++i) {
                    that.mouses[i].style.display = 'none';
                }
                that.text(that.defn[0], ENDING_MESSAGE);
                that.text(that.gameStart[0], START);               

                finished = true;
            }
        }, 1000);
    },

    newGame: function() {

        that = this;

        clearInterval(timer);
        timer = null;
        clearInterval(values);
        for (var i = 0, j = that.mouses.length; i < j; ++i) {
            that.mouses[i].style.display = 'none';
        }
        that.text(that.gameTime[0], 0); 
        that.text(that.defn[0], ENDING_MESSAGE);
        that.text(that.gameStart[0], START);
        finished = true;
    },

    clear: function() {
        var that = this;

        clearInterval(timer);
        timer = null;
        clearInterval(values);
  
        for (var i = 0, j = that.mouses.length; i < j; ++i) {
                    that.mouses[i].style.display = 'none';
        }
    },

    // start the game
    startGame: function() {
        this.score = 0;
        this.totalTime = 60;
        this.text(this.gameTime[0], this.totalTime);
        this.text(this.gameScore[0], this.score); 
        this.text(this.gameStart[0], END); 
        finished = false;      

        this.clear();
        this.setDef();
        this.countDown();
        this.setVal();
        this.pickValue();
    }
};

new MouseGame();