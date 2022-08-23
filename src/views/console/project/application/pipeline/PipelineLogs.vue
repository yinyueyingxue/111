<template>
    <div>
        <el-steps :active="pipelineStep" simple finish-status="success">
            <el-step title="拉取代码" id="step1" icon="el-icon-edit"></el-step>
            <el-step title="代码编译" id="step2" icon="el-icon-upload"></el-step>
            <el-step title="代码质量扫描" id="step3" icon="el-icon-edit-outline"></el-step>
            <el-step title="单元测试检查" id="step4" icon="el-icon-edit-outline"></el-step>
            <el-step title="构建镜像" id="step5" icon="el-icon-caret-right"></el-step>
            <el-step title="服务部署" id="step6" icon="el-icon-refresh"></el-step>
            <el-step title="部署检查" id="step7" icon="el-icon-s-check"></el-step>
        </el-steps>
        <div id="loghtml" class="logtextStyle">
            {{logs}}
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
                pipelineStep: 0,
                podId: 0,
                logs: '',
            }

        },
        mounted() {
            this.$nextTick(function () {

                document.getElementById('loghtml').style.height = '94vh'

            })
        },
        created() {
            this.podId = this.$route.query.pipelineId
            this.buildLog()
        },
        methods: {
            bsStep(index, color) {

                if (color == 1) {
                    this.pipelineStep = index
                }
                if (color == 2) {
                    this.pipelineStep = index
                    let classVal = document.getElementById("step" + index).getAttribute("class");
                    classVal = classVal.concat(" failColor")
                    document.getElementById("step" + index).setAttribute("class", classVal)
                }

            },


            buildLog() {
                let that = this
                if (this.podId == 0) {
                    this.logs = '暂无数据'
                    return;
                }
                let params = {

                    curl: $themeConfig.app.projectHttpUrl + '/build/' + this.podId + '/log'
                }
                this.$store.dispatch('httpGet', params).then(function (res) {

                    let bodyHeight = document.getElementById('loghtml').style.height;
                    let position = document.getElementById('loghtml').scrollTop;
                    let mutilNum = document.getElementById('loghtml').scrollHeight - position - bodyHeight;
                    //失败2 开始0 成功1
                    that.logs = res
                    if (res.indexOf("#拉取代码成功#") != -1) {
                        that.bsStep(1, 1);
                        // bsStep(2, 0);
                    } else if (res.indexOf("#开始拉取代码#") != -1 && res.indexOf("Finished: FAILURE") == -1) {
                        that.bsStep(1, 0);
                    } else if (res.indexOf("#开始拉取代码#") != -1 && res.indexOf("Finished: FAILURE") != -1) {
                        that.bsStep(1, 2);
                    }
                    ;
                    //失败2 开始0 成功1
                    if (res.indexOf("#编译成功#") != -1) {
                        that.bsStep(2, 1);
                        // bsStep(3, 0);
                    } else if (res.indexOf("#开始编译#") != -1 && res.indexOf("Finished: FAILURE") == -1) {
                        that.bsStep(2, 0);
                    } else if (res.indexOf("#开始编译#") != -1 && res.indexOf("Finished: FAILURE") != -1) {
                        that.bsStep(2, 2);
                    }

                    if (res.indexOf("#代码质量检查通过#") != -1) {
                        that.bsStep(3, 1);
                        // bsStep(4, 0);
                    } else if (res.indexOf("#代码质量检测未启用，跳过代码质量检测#") != -1) {
                        document.getElementById("step3").setAttribute("hidden", true)
                    } else if (res.indexOf("#开始代码质量检查#") != -1 && res.indexOf("Finished: FAILURE") == -1) {
                        that.bsStep(3, 0);
                    } else if (res.indexOf("#开始代码质量检查#") != -1 && res.indexOf("Finished: FAILURE") != -1) {
                        that.bsStep(3, 2)
                    }

                    if (res.indexOf("#单元测试通过#") != -1) {
                        that.bsStep(4, 1);
                        // bsStep(5, 0);
                    } else if (res.indexOf("#单元测试未启用，跳过单元测试#") != -1) {
                        document.getElementById("step4").setAttribute("hidden", true)
                    } else if (res.indexOf("#开始单元测试#") != -1 && res.indexOf("Finished: FAILURE") == -1) {
                        that.bsStep(4, 0);
                    } else if (res.indexOf("#开始单元测试#") != -1 && res.indexOf("Finished: FAILURE") != -1) {
                        that.bsStep(4, 2)
                    }

                    if (res.indexOf("#build docker镜像件成功#") != -1) {
                        that.bsStep(5, 1);
                        // bsStep(6, 0);
                    } else if (res.indexOf("#开始build docker镜像#") != -1 && res.indexOf("Finished: FAILURE") == -1) {
                        that.bsStep(5, 0);
                    } else if (res.indexOf("#开始build docker镜像#") != -1 && res.indexOf("Finished: FAILURE") != -1) {
                        that.bsStep(5, 2);
                    }
                    ;
                    if (res.indexOf("#部署到集群完成#") != -1) {
                        that.bsStep(6, 1);
                        that.bsStep(7, 0);
                    } else if (res.indexOf("#开始部署到集群#") != -1 && res.indexOf("Finished: FAILURE") == -1) {
                        that.bsStep(6, 0);
                    } else if (res.indexOf("#开始部署到集群#") != -1 && res.indexOf("Finished: FAILURE") != -1) {
                        that.bsStep(6, 2);
                    }
                    ;
                    if (res.indexOf("Finished: SUCCESS") != -1) {
                        that.bsStep(7, 1);
                    } else if (res.indexOf("#部署到集群失败，流水线退出#") != -1 && res.indexOf("Finished: FAILURE") != -1) {
                        that.bsStep(7, 2);
                    }
                    document.getElementById('loghtml').innerHTML = res;

                    //if(position == 0   ||  mutilNum < 1 ){

                    try {
                        document.getElementById('loghtml').scrollTo(0, document.getElementById('loghtml').scrollHeight);
                    } catch (e) {
                        window.scrollTo(0, document.getElementById('loghtml').scrollHeight);
                    }
                    document.getElementById('loghtml').scrollHeight
                    // window.scrollTo(0,document.body.scrollHeight);
                    //}
                    if (res.indexOf("Finished: SUCCESS") === -1 && res.indexOf("Finished: FAILURE") === -1) {
                        setTimeout(function () {
                                that.buildLog()
                            }, 5000
                        );
                    }
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

        margin-bottom: 0px;
        font-size: smaller;
        line-height: 2.0em;
    }

    .failColor {
    }

    .failColor .el-step__title.is-success {
        color: #FF0000 !important;
    }

    .failColor .el-icon-check:before {
        content: "\e79d";
        size: 100px;
    }

    .failColor .el-step__head.is-success {
        color: #FF0000 !important;
    }

    .el-step.is-simple .el-step__icon-inner.is-status {
        transform: scale(1.4) translateY(1px);
    }
</style>
