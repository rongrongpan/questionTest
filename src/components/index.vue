<template>
  <div class="container">
    <!-- 标题 -->
    <div class="title" v-if="questionList.length">
        <p class="linkName">{{testTitle}}</p>
        <p class="desc">共 {{questionList.length}} 题 可重复作答，以巩固知识</p>
    </div>
    <!-- 答题结果 -->
    <div class="result boxshadow" v-if="myInfoTest.lessonId">
        <p class="tit">{{alreadyCheck?'本次':'最近'}}测试结果</p>
        <ul>
            <li>
                <p class="num right">{{myInfoTest.passRate.correctCount}}</p>
                <p class="desc">答对题目</p>
            </li>
            <li>
                <p class="num error">{{myInfoTest.passRate.errorCount}}</p>
                <p class="desc">答错题目</p>
            </li>
            <li>
                <p class="num per">{{myInfoTest.passRate.percentage}}</p>
                <p class="desc">正确率</p>
            </li>
        </ul>
    </div>
    <!-- 题目列表 -->
    <div class="question boxshadow" v-if="showQuestion">
        <ul class="list">
            <li v-for="(item,index) in questionList" :key="item.id">
                <div class="number">
                    <span class="line"></span>
                    <span class="num">{{index+1>9?index+1:'0'+(index+1)}}</span>
                    <span class="line"></span>
                </div>
                <p class="title">{{item.problemTitle}}</p>
                <template v-if="item.optionsList.length">
                    <ul class="anwer">
                        <li 
                            :class="[el.optionValue===item.value?'active':'']" 
                            @click="changeAnwer(item.id,el.optionValue)"
                            v-for="el in item.optionsList" 
                            :key="el.optionValue">
                                <span class="radio"></span>{{el.optionKey}}
                            </li>
                    </ul>
                    <p class="errorText arrow" v-if="!item.value&&alreadyCheck"> <img src="@/assets/icon1.png" alt="图片"> 未作答，根据所学知识作答</p>
                </template>
                <textarea class="suggest" v-else v-model="suggest" cols="30" rows="10"></textarea>
            </li>
        </ul>
        <ul class="list">

        </ul>
        <button :class="[showCheck?'active':'']" @click="checkAnwer">提交答案</button>
    </div>
    <!-- 错题解析 -->
    <div class="question boxshadow" v-else>
        <template v-if="myInfoTest.worngList&&myInfoTest.worngList.length">
            <p class="title">错题解析</p>
            <ul class="list">
                <li v-for="(item,index) in myInfoTest.worngList" :key="item.problemId">
                    <div class="number">
                        <span class="line"></span>
                        <span class="num">{{index+1>9?(index+1):'0'+(index+1)}}</span>
                        <span class="line"></span>
                    </div>
                    <p class="title">{{item.problemTitle}}</p>
                    <p class="theAnwer">你的答案：<span class="myerror">{{item.userAnswer}}</span></p>
                    <p class="theAnwer">正确答案：<span class="right">{{item.correctAnswer}}</span></p>
                    <p class="beause"><span>答案解析：</span>{{item.answerAnalysis}}</p>
                </li>
            </ul>
        </template>
        <button class="active" @click="lessonQuestion(true)">再次答题</button>
    </div>

    <!-- 学习进度-课程列表 -->
    <div class="progress boxshadow" v-if="classList.length">
        <p class="title">学习进度</p>
        <div class="list">
            <a :href="'/'+item.lessonId" v-for="item in classList" :key="item.id">
                <div class="left">
                    <p class="name">{{item.lessonChapter}}</p>
                    <p class="already" v-if="item.schedule==='1'">已答题</p>
                </div>
                <p class="righttitle">{{item.lessonName}}</p> 
            </a>
        </div>
    </div>
    <p class="from">杭州越易蓝科技有限公司提供技术支持</p>

    <!-- 弹窗 -->
    <div class="box-shadow" v-if="!toLogin"></div>
    <!-- 登录 -->
    <div class="login boxshadow" v-if="!toLogin">
        <p class="title">填写个人信息</p>
        <p class="desc">请如实填写以下信息，手机号不可随意更换。</p>
        <input type="text" v-model="userInfo.name" class="name" placeholder="填写真实姓名">
        <input type="number" v-model="userInfo.phone" :class="[errorPhone?'phone error':'phone']" @change="changePhone" placeholder="填写联系手机号">
        <p class="errorText" v-if="errorPhone"><img src="@/assets/icon1.png" alt="图片"> 请填写正确的手机号</p>
        <select :class="['select',userInfo.area===''?'none':'']" v-model="userInfo.area" placeholder="请选择所属区">
            <option value ="" style="color:#C0C4CC;" disabled>请选择所属区</option>
            <option style="color:#333;" :value ="item" v-for="item in areaList" :key="item">{{item}}</option>
        </select>
        <input type="text" v-model="userInfo.company" class="company" placeholder="填写公司名称（选填）">
        <button @click="getLogin" :class="[userInfo.name&&userInfo.phone&&userInfo.area?'active':'']">确定</button>
    </div>
    <!-- 报错 -->
    <div class="errorPop" v-show="showError">
        <img src="@/assets/icon.png" alt="图表">
        <p>{{errorText}}</p>
    </div>
    <!-- loading -->
    <div class="errorPop" v-show="showLoading">
       <svg class="icon" style="width: 4rem; height: 4rem;vertical-align: middle;fill: #ccc;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1646"><path d="M393.664871 495.52477c0 11.307533-9.168824 20.466124-20.466124 20.466124l-103.671151 0c-11.307533 0-20.466124-9.15859-20.466124-20.466124 0-11.2973 9.15859-20.466124 20.466124-20.466124l103.671151 0C384.496048 475.058646 393.664871 484.22747 393.664871 495.52477zM805.207925 495.52477c0 11.307533-9.15859 20.466124-20.466124 20.466124l-103.671151 0c-11.2973 0-20.466124-9.15859-20.466124-20.466124 0-11.2973 9.168824-20.466124 20.466124-20.466124l103.671151 0C796.049335 475.058646 805.207925 484.22747 805.207925 495.52477zM547.600823 237.917668l0 103.671151c0 11.307533-9.15859 20.466124-20.466124 20.466124s-20.466124-9.15859-20.466124-20.466124l0-103.671151c0-11.307533 9.15859-20.466124 20.466124-20.466124C538.442232 217.451544 547.600823 226.610134 547.600823 237.917668zM547.600823 649.460722l0 103.681384c0 11.2973-9.15859 20.466124-20.466124 20.466124s-20.466124-9.168824-20.466124-20.466124l0-103.681384c0-11.2973 9.15859-20.466124 20.466124-20.466124C538.442232 628.994598 547.600823 638.163421 547.600823 649.460722zM411.562497 428.754041c-3.786233 6.569626-10.673084 10.233062-17.733896 10.233062-3.479241 0-6.999414-0.880043-10.222829-2.742461l-89.774653-51.861158c-9.782807-5.658883-13.129019-18.173918-7.480368-27.956725 5.658883-9.79304 18.173918-13.139252 27.956725-7.490601l89.774653 51.861158C413.864936 406.456199 417.22138 418.971234 411.562497 428.754041zM767.918647 634.633015c-3.796466 6.559393-10.673084 10.233062-17.744129 10.233062-3.469008 0-6.989181-0.890276-10.212596-2.752694l-89.774653-51.861158c-9.782807-5.64865-13.139252-18.173918-7.480368-27.956725 5.64865-9.79304 18.173918-13.139252 27.956725-7.480368l89.774653 51.861158C770.221086 612.32494 773.567297 624.850208 767.918647 634.633015zM673.723312 282.70778l-51.861158 89.76442c-3.786233 6.559393-10.673084 10.233062-17.744129 10.233062-3.469008 0-6.989181-0.890276-10.212596-2.752694-9.79304-5.64865-13.139252-18.163685-7.480368-27.956725l51.861158-89.76442c5.64865-9.79304 18.163685-13.139252 27.956725-7.490601C676.025751 260.399705 679.382195 272.91474 673.723312 282.70778zM467.854571 639.053698l-51.861158 89.774653c-3.796466 6.559393-10.673084 10.233062-17.744129 10.233062-3.479241 0-6.999414-0.890276-10.222829-2.752694-9.782807-5.658883-13.139252-18.173918-7.480368-27.956725l51.861158-89.774653c5.658883-9.782807 18.173918-13.129019 27.956725-7.480368C470.15701 616.755856 473.503221 629.27089 467.854571 639.053698zM460.435601 379.911636c-3.213181 1.862417-6.733355 2.742461-10.202363 2.742461-7.081279 0-13.957897-3.673669-17.744129-10.243295l-51.809993-89.795119c-5.64865-9.79304-2.292206-22.308075 7.500834-27.956725 9.79304-5.64865 22.308075-2.292206 27.956725 7.500834l51.79976 89.795119C473.585085 361.747951 470.228641 374.262986 460.435601 379.911636zM666.089447 736.400816c-3.223415 1.852184-6.743588 2.742461-10.212596 2.742461-7.071046 0-13.957897-3.673669-17.744129-10.243295l-51.79976-89.805352c-5.64865-9.79304-2.292206-22.308075 7.500834-27.956725 9.782807-5.64865 22.297842-2.281973 27.946492 7.500834l51.809993 89.805352C679.238932 718.237131 675.882488 730.752166 666.089447 736.400816zM760.499677 384.526747l-89.795119 51.809993c-3.223415 1.852184-6.743588 2.742461-10.212596 2.742461-7.071046 0-13.957897-3.673669-17.744129-10.243295-5.64865-9.79304-2.292206-22.308075 7.500834-27.956725l89.805352-51.809993c9.782807-5.638417 22.297842-2.281973 27.946492 7.500834C773.649162 366.363062 770.292718 378.878097 760.499677 384.526747zM404.02073 590.180594l-89.805352 51.79976c-3.213181 1.862417-6.733355 2.742461-10.202363 2.742461-7.081279 0-13.957897-3.673669-17.744129-10.243295-5.64865-9.79304-2.292206-22.308075 7.500834-27.956725l89.795119-51.79976c9.79304-5.64865 22.308075-2.292206 27.956725 7.500834S413.81377 584.531943 404.02073 590.180594z" class="loading"></path></svg>
       <p>加载中...</p>
    </div>
  </div>
</template>

<script>
import commonJs from '@/commonJs'
import api from '@/api/api'
export default {
    data(){
        return{
            toLogin:true,//是否已登录
            numberTest:1,//是第几个课程
            userInfo:{
                name:"",
                phone:"",
                company:"",
                userId:null,
                area:""
            },//用户基本信息
            areaList:['上城区','下城区','江干区','拱墅区','西湖区','风景名胜区','滨江区','萧山区','钱塘新区','余杭区','富阳区','临安区','桐庐县','淳安县','建德市'],//区域列表
            errorPhone:false,//手机号错误提示
            errorText:'',//错误信息
            showLoading:false,//正在加载中
            showError:false,//错误提示
            alreadyCheck:false,//是否点击了提交答案
            showCheck:false,//是否全部题目都已选择
            myInfoTest:{},//个人答题信息,错题解析
            classList:[],//课程列表
            questionList:[],//题目列表
            testTitle:'',//课题名称
            startTime:'',//记录开始时间
            showQuestion:true,//是否显示题目
            suggest:"",//满意度调查，意见与建议
            anwerLength:0,//必填题目的数量
        }
    },
    methods:{
        //登录
        getLogin(){
            if(!this.userInfo.name){
                this.errorPop('请填写姓名');
                return false;
            }else if(!this.userInfo.phone){
                this.errorPop('请填写手机号码');
                return false;
            }else if(!(/^1[3456789]\d{9}$/.test(this.userInfo.phone))){
                this.errorPhone = true;
                return false;
            }else if(!this.userInfo.area){
                this.errorPop('请填写所属区');
                return false;
            }else{
                if(this.errorPhone){
                    this.errorPhone = false;
                }
                api.getLogin({
                    answerName:this.userInfo.name,
                    answerPhone:this.userInfo.phone,
                    answerFirm:this.userInfo.company,
                    answerArea:this.userInfo.area
                }).then(res=>{
                    if(res.data.code===0){
                        this.toLogin = true;
                        let data = res.data.data.systemUser;
                        this.userInfo = {
                            name:data.answerName,
                            phone:data.answerPhone,
                            company:data.answerFirm,
                            userId:data.id
                        }
                        this.getMyInfo();
                        commonJs.saveCookie('userId',this.userInfo.userId,7);
                    }
                })
            } 
        },
        //选择答题结果
        changeAnwer(id,value){
            let arr =JSON.parse(JSON.stringify(this.questionList));
            let checkLength = 0;
            arr.forEach(function(ele){
                if(ele.id===id){
                    ele.value = value;
                    checkLength++;
                }else if(ele.value){
                    checkLength++;
                }
            })
            if(checkLength===this.anwerLength){
                this.showCheck = true;
            }else{
                this.showCheck = false;
            }
            this.questionList = arr;
        },
        //提交答案
        checkAnwer(){
            this.alreadyCheck = true;
            if(this.showCheck){
                //请求接口
                this.submitTest();
            }else{
                this.errorPop('做完所有题目才可以提交答案');
                return false;
            }
        },
        //获取课程列表
        lessonList(){
            api.lessonList({
                userId:this.userInfo.userId
            }).then(res=>{
                if(res.data.code===0){
                    this.classList = res.data.data.titleList;
                }else if(res.data.code===30000){
                    this.toLogin = false;
                } 
            })
        },
        //获取课程题目
        lessonQuestion(flag){
            if(flag){
                this.$set(this.myInfoTest,'worngList',[]);
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                let arr = this.questionList;
                arr.forEach(function(ele){
                    ele.value = "";
                })
                this.questionList = arr;
                this.alreadyCheck = false;
                this.startTime = new Date().getTime();
                this.showQuestion = true;
                this.suggest="";
            }
            if(this.questionList.length){
                return false;
            }
            api.lessonQuestion({id:this.numberTest}).then(res=>{
                if(res.data.code===0){
                    this.questionList = res.data.data.problems;
                    let index = 0;
                    this.questionList.forEach(function(ele){
                        if(ele.optionsList.length){
                            index++;
                        }
                    })
                    this.anwerLength = index;
                    this.testTitle = res.data.data.lesson.lessonName;
                }else if(res.data.code===30000){
                    this.toLogin = false;
                } 
            })
        },
        //判断手机号的正确率
        changePhone(){
            if(!(/^1[3456789]\d{9}$/.test(this.userInfo.phone))){
                this.errorPhone = true;
            }else{
                this.errorPhone = false;
            }
        },
        //报错弹窗
        errorPop(error){
            this.errorText = error;
            this.showError = true;
            let timer = setTimeout(()=>{
                this.showError = false;
                clearTimeout(timer);
            },1000)
        },
        //个人信息
        getMyInfo(){
            api.myInfo({
                userId:this.userInfo.userId,
                lessonId:this.numberTest
            }).then(res=>{
                this.lessonList();
                if(res.data.code===0){
                    let data = res.data.data;
                    if(data.classResult){//该期已答过
                        this.myInfoTest = data.classResult;
                        this.showQuestion = false;
                    }
                }else{
                    this.toLogin = false;
                }  
            })
        },
        //答题提交
        submitTest(){
            let arr = [];
            let that = this;
            this.questionList.forEach(function(ele){
                if(ele.optionsList.length){
                    arr.push({
                        problemResult:ele.value,
                        problemId:ele.id,
                        problemType:ele.problemType
                    })
                }else{
                    arr.push({
                        problemResult:that.suggest,
                        problemId:ele.id,
                        problemType:ele.problemType
                    })
                }
                
            })
            this.showLoading = true;
            api.getResult({
                lessonId:this.numberTest,
                userId:this.userInfo.userId,
                resultList:arr,
                answerTime:new Date().getTime() - this.startTime
            }).then(res=>{
                this.showLoading = false;
                this.showQuestion = false;
                if(res.data.code===0){
                    this.myInfoTest = res.data.data.classResult;
                    this.classList = res.data.data.learnProgress;
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                }else if(res.data.code===30000){
                    this.toLogin = false;
                } 
            })
        }
    },
    created(){
        //根据路径判断当前请求的是第几节课
        let number = window.location.href.split('/');
        let id = Number(number[number.length-1]);
        if(id>0){
            this.numberTest = id;
        }else{
            id = 1;
        }
        this.numberTest = id;
        this.startTime = new Date().getTime();
        this.lessonQuestion(false);
        //判断是否需要登录
        let info = commonJs.getCookie('userId');
        if(info){
            this.$set(this.userInfo,'userId',JSON.parse(info));
            this.getMyInfo();
        }else{
            //走登录
            this.toLogin = false;
        }
    }
}
</script>

<style>

</style>