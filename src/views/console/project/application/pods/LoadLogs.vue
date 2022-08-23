<template>
    <div style="margin: 10px;">
        <div style="margin: 15px;">
            <el-row>
                <el-col :span="3">
                    <el-input v-model="querySearch" placeholder="关键字"></el-input>
                </el-col>


                <el-col :span="4" style="text-align: center;">日志类型

                    <el-select v-model="logLevel" placeholder="请选择" style="padding-left: 5px">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>

                </el-col>

                <el-col :span="4" style="text-align: center;" >
                    数据来源
                    <el-select v-model="sourceType" placeholder="请选择" style="padding-left: 5px">
                        <el-option value=""
                                   label="全部来源"
                        >

                        </el-option>

                        <el-option
                                label="控制台输出"
                                value="stdout">

                        </el-option>
                        <el-option
                                label="日志文件"
                                value="log">

                        </el-option>
                    </el-select>

                </el-col>


                <el-col :span="4" style="text-align: center;" >
                    <div class="block" >
                        日期
                        <el-date-picker
                                style="padding-left: 5px"
                                v-model="startTime"
                                type="datetime"
                                :picker-options="pickerOptions"
                                placeholder="选择日期时间"
                                default-time="12:00:00">
                        </el-date-picker>
                    </div>
                </el-col>
                <el-col :span="2" style="text-align: center;">
                    <el-button type="primary" icon="el-icon-search" circle @click="searchClick()"></el-button>
                    <el-button type="success" icon="el-icon-refresh" circle @click="freshClick()"></el-button>
                </el-col>


            </el-row>


        </div>

        <div id="loghtml" class="logtextStyle">
            <p v-for="(item, index) in logData" :key="index">
                {{item.message}}

            </p>
        </div>


    </div>
</template>

<script>
    import {
        $themeConfig
    } from '@themeConfig'

    export default {
        data() {
            return {
                count: 10,
                startTime: 0,
                fromId: 0,
                projectId: '',
                podId: '',
                service: '',
                loadstatus: 0,
                querySearch: '',
                logLevel: '',
                sourceType: '',
                logData: [],
                options: [{
                    value: '',
                    label: '全部类型'
                }, {
                    value: 'DEBUG',
                    label: 'DEBUG'
                }, {
                    value: 'INFO',
                    label: 'INFO'
                }, {
                    value: 'WARN',
                    label: 'WARN'
                }, {
                    value: 'ERROR',
                    label: 'ERROR'
                }],
                pickerOptions: {
                    shortcuts: [{
                        text: '半小时前',
                        onClick(picker) {
                            const date = new Date();
                            picker.$emit('pick', date.getTime() - 3600 * 1000 * 0.5);
                        }
                    }, {
                        text: '一小时前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '三小时前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 3);
                            picker.$emit('pick', date);
                        }
                    },
                        {
                            text: '一天前',
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(date.getTime() - 3600 * 1000 * 24);
                                picker.$emit('pick', date);
                            }
                        },
                        {
                            text: '一周前',
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit('pick', date);
                            }
                        }
                    ]
                },
            }
        },

        mounted() {
            this.$nextTick(function () {
                this.onload()

                if (document.addEventListener) {
                    document.addEventListener('DOMMouseScroll', this.getScrollTop, false);
                }//W3C
                window.onmousewheel = document.onmousewheel = this.getScrollTop;//IE/Opera/Chrome
            })
        },
        created() {
        },
        methods: {
            searchClick() {
                this.fromId = 0
                this.logData = []
                this.podLog(this.podId)

            },
            freshClick() {
                this.fromId = 0;
                this.logData = []
                this.podLog(this.podId)
            },
            onload() {
                this.podId = this.$route.query.podId
                this.projectId = this.$route.query.projectId
                this.service = this.$route.query.service
                document.body.style.overflow = 'hidden'
                this.startTime = new Date().getTime() - 5 * 60 * 1000
                this.podLog(this.podId);
            },

            // 获取滚动条当前的位置
            getScrollTop() {

                let bodyHeight = document.getElementById('loghtml').style.height;
                let position = document.getElementById('loghtml').scrollTop;
                let mutilNum = document.getElementById('loghtml').scrollHeight - position - bodyHeight.replace("px", "");

                if (mutilNum < 0 && this.loadstatus == 0) {//IE/Opera/Chrome
                    this.podLog(this.podId);
                }
            },
            podLog(podId) {
                let that = this
                this.loadstatus = 1;
                document.getElementById('loghtml').style.height = (window.innerHeight - 80) + 'px'
                this.count = this.count + 10

                setTimeout(function () {
                    that.loadstatus = 0;
                }, 1000)
                let queryMap = {}

                if (that.logLevel != '') {
                    queryMap.logLevel = that.logLevel
                }
                if (that.sourceType != '') {
                    queryMap.sourceType = that.sourceType
                }
                if (that.querySearch != '') {
                    queryMap.message = that.querySearch
                }

                if (this.projectId == '') {
                    queryMap.k8s_container_name = this.podId;
                } else {
                    queryMap.k8s_pod = this.podId;
                }
                let params = {
                    "startTime": new Date(this.startTime).getTime(),
                    "fromId": this.fromId,
                    "size": 100,
                    "queryMap": queryMap,
                    curl: $themeConfig.app.projectHttpUrl + '/pod/' + this.podId + '/' + this.service + '/eslog'
                }
                if (podId == null) {
                    $('#loghtml').html("暂无日志");
                    return;
                }
                this.$store.dispatch('httpPost', params).then(function (res) {
                    const tmpData = res.data
                    for (var i = 0; i < tmpData.length; i++) {
                        that.logData.push(tmpData[i])
                    }
                    that.fromId = that.fromId + tmpData.length

                })
            }


        }
    }
</script>

<style>

    .logtextStyle {
        overflow-y: visible;
        overflow-x: hidden;
        text-overflow: initial;
        word-wrap: normal;
        padding: 10px;
        word-break: keep-all;
        white-space: pre-wrap;
        color: #000000;
        background-color: #F0F0F0;
        border: 1px solid lightgray;
        border-radius: 5px;
        margin: 15px;
        font-size: smaller;
        line-height: 2.0em;
    }
</style>
