<template>
    <section id="dashboard-analytics">
        <b-row class="match-height">
            <b-col md="6">
                <b-card class="analyticsFlex" style="text-align: center">
                    <b-row class="match-height">
                        <b-col md="6">
                            <div class="pie-text text-center">
                                <h2 class="font-weight-bolder">{{serviceNo}}</h2>
                                <span class="font-weight-bold">服务数</span>
                            </div>
                            <!-- echart -->
                            <ServiceStatisticsChart :series="series" style="height:200px"/>
                        </b-col>

                        <b-col md="6">
                            <div class="pie-text text-center">
                                <h2 class="font-weight-bolder">{{podNo}}</h2>
                                <span class="font-weight-bold">实例数</span>
                            </div>
                            <!-- echart -->
                            <ServiceStatisticsChart :series="series" style="height:200px"/>
                        </b-col>
                        <b-col md="12">
                            <b-row class="match-height" style="text-align: center;">
                                <b-col md="4">
                                    <p style="font-weight: bold; font-size: 14px">{{level0}}</p>
                                    <p style="color: green;">低危</p>
                                </b-col>

                                <b-col md="4">
                                    <p style="font-weight: bold; font-size: 14px">{{level1}}</p>
                                    <p style="color: sandybrown ;">中危</p>
                                </b-col>

                                <b-col md="4">
                                    <p style="font-weight: bold; font-size: 14px">{{level2}}</p>
                                    <p style="color: red;">高危</p>
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                </b-card>
            </b-col>
            <b-col md="6">
                <b-card>
                    <b-row>
                        <b-col md="6">
                            <h2>平均流量(时)</h2>
                            <p>{{avgLog}}</p>
                        </b-col>

                        <b-col md="6">
                            <h2>24小时请求数</h2>
                            <p>{{logTotal}}</p>
                        </b-col>

                        <b-col>
                            <CPUStatusChart :option-data="option2" style="height: 200px;"/>
                            <!-- <LogStatisticsChart :optionData="options" style="height:268px" /> -->
                        </b-col>
                    </b-row>
                </b-card>
            </b-col>
        </b-row>


        <b-row class="match-height" style="background-color: #fff; padding-top: 20px">
            <b-col md="12">
                <b-card>
                    <b-form-group class="rowBg">
                        <!-- <v-select v-model="selected" label="id" :options="option" /> -->
                        <el-select v-model="selected" placeholder="请选择" filterable style="width: 100%">
                            <el-option v-for="(item, index) in projectOptions" :key="index" :value="item.service"
                                       :label="item.service + ' ' + item.name"/>
                        </el-select>
                    </b-form-group>
                </b-card>
            </b-col>
            <b-col md="4">
                <b-card title="实例列表">
                    <b-table :items="items" :fields="fields" fixed responsive="sm" class="examplesTable">
                        <template #cell(id)="data">
                            <div id="tooltip-show" class="id_text">{{ data.value }}</div>
                            <b-tooltip target="tooltip-show" :title="data.value">{{ data.value }}</b-tooltip>
                        </template>
                    </b-table>
                </b-card>
            </b-col>
            <b-col md="4">
                <b-card title="实例CPU 使用率(1m avg，单位1核)">
                    <LogStatisticsChartLine :optionData="cpuSeries" :xdata="cpuX"/>
                </b-card>
            </b-col>
            <b-col md="4">
                <b-card title="实例 内存使用量(MiB)">
                    <LogStatisticsChartLine :optionData="memerySeries" :xdata="cpuX"/>
                </b-card>
            </b-col>
        </b-row>

        <b-row class="match-height" style="background-color: #fff; padding: 20px">
            <b-col md="4" v-show="loadingFlag">
                <b-card title="请求TOP10">
                    <div v-for="(item, index) in slowList" :key="index + item.label" class="progress-wrapper">
                        <b-card-text class="mb-0">
                            {{item.label}} {{item.value}}ms
                        </b-card-text>
                        <b-progress :value="item.value" :max="maxProgress"/>
                    </div>
                </b-card>
            </b-col>
            <b-col md="4" v-show="loadingFlag">
                <b-card :title="'服务平均可用性(SLA): '+avgSla.toFixed(2)+'%'">
                    <SLAChart :series="slaSeries" :timeData="lastTime"/>
                </b-card>
            </b-col>
            <b-col md="4" v-show="loadingFlag">
                <b-card :title="'服务每分钟平均请求数(CPM): '+cpm.toFixed(2)">
                    <LogStatisticsChart :optionData="options"/>
                </b-card>
            </b-col>
        </b-row>
    </section>
</template>

<script>
    import vSelect from 'vue-select'
    import LogStatisticsChart from './LogStatisticsChart'
    import LogStatisticsChartLine from './LogStatisticsChart-line'
    import CPUStatusChart from './CPUStatusChart.vue'
    import ServiceStatisticsChart from './ServiceStatisticsChart.vue'
    import SLAChart from './SLAChart.vue'

    import {$themeConfig} from '@themeConfig'

    export default {
        components: {
            LogStatisticsChart,
            LogStatisticsChartLine,
            CPUStatusChart,
            ServiceStatisticsChart,
            SLAChart,
            vSelect
        },
        data() {
            return {
                data: {},
                serviceNo: 0,
                podNo: 0,
                avgSla: 0,
                cpm: 0,
                level0: 0,
                level1: 0,
                level2: 0,
                loadingFlag: false,
                options: {
                    xAxisData: [],
                    series: [],
                },
                cpuSeries: [],
                memerySeries: [],
                podList: [],
                slowList: [],
                items: [],
                lastTime: [],
                cpuX: [],
                fields: [{
                    key: 'id',
                    label: '实例',
                    headerTitle: '实例'
                }, {
                    key: 'time',
                    label: '创建时间',
                    headerTitle: '创建时间'
                }],
                option2: {
                    xAxisData: [],
                    series: [{
                        type: 'line',
                        stack: 'Total',
                        areaStyle: {},
                        showSymbol: false,
                        lineStyle: {
                            width: 0,
                        },
                        data: [],
                    }],
                },
                logTotal: 0,
                avgLog: 0,
                selected: {},
                projectOptions: [], // 租户列表
                projectId: '', // 当前租户id
                maxProgress: 0,
                podParam: [],
                series: [{
                    name: 'Visit source',
                    type: 'pie',
                    radius: ['75%', '85%'],
                    avoidLabelOverlap: true,
                    label: {
                        show: false,
                    },
                    labelLine: {
                        show: false,
                    },
                    data: [{
                        value: 335,
                        // name: 'Point One'
                    }],
                }],
                slaSeries: [],
                option: [],
            }
        },
        mounted() {
            this.logViews()
        },

        watch: {
            selected: {
                handler(newVal, oldVal) {
                    this.selectPod()
                },
                deep: true,
            },
            /* projectId: {
                 handler(newVal, oldVal) {
                     this.selectPod()
                 },
                 deep: true
             }*/
        },
        created() {
            // data
            this.projectTotal()
            this.warnCount()
            this.projectPod()
        },
        methods: {
            logViews() {
                let that = this
                let _data = {
                    curl: $themeConfig.app.projectHttpUrl + '/service/log',
                    projectId: this.$store.state.myRequest.projectId
                }
                that.$store.dispatch('httpGet', _data).then(function (res) {
                    const tmpData = res.data.statistics
                    that.logTotal = res.data.request.num
                    that.avgLog = Math.round(that.logTotal / 24)
                    that.option2.xAxisData = tmpData.labels
                    that.option2.series[0].data = tmpData.labelsRequest
                })
            },

            selectPod() {
                let podDomData = []
                const that = this
                that.podParam = []
                that.podList.forEach(function (e) {
                    console.log(e);
                    // if (e.service.indexOf(that.selected) >= 0) {
                    if (e.service === that.selected) {
                        podDomData.push({
                            id: e.id,
                            time: e.createTime
                        })
                        that.podParam.push(e.id)
                    }
                })

                that.items = podDomData
                let _data = {
                    curl: $themeConfig.app.httpUrl + '/monitor/v1.0/sw/graph',
                    serviceName: that.selected
                    // serviceName: that.projectId
                }
                that.$store.dispatch('httpPost', _data).then(function (res) {
                    that.slowList = []
                    that.slaSeries = []
                    that.lastTime = []
                    that.options.series = []
                    that.loadingFlag = false
                    if (res.code === 20216) {
                        that.loadingFlag = true
                        const tmpData = res.data.data

                        that.slowList = tmpData.serviceSlowEndpoint
                        let dt = new Date() - 60 * 1000 * 60
                        const tmpList = tmpData.serviceSLA.values
                        let totalSla = 0
                        let totalCpm = 0
                        tmpList.forEach(function (v) {
                            const tmpDate = new Date(dt)
                            that.lastTime.push(tmpDate.getHours() + ":" + tmpDate.getMinutes())
                            that.slaSeries.push(v.value / 100)
                            if (v.value === 10000) {
                                totalSla++
                            }

                            dt = dt + 1000 * 60
                        })
                        tmpData.serviceThroughput.values.forEach(function (v) {
                            that.options.series.push(v.value)
                            totalCpm = totalCpm + v.value
                        })
                        that.cpm = totalCpm / tmpData.serviceThroughput.values.length
                        that.avgSla = (totalSla / tmpList.length) * 100
                        that.options.xAxisData = that.lastTime

                        that.maxProgress = that.slowList[0].value
                    }
                })
                that.updateCpuMemory()
            },

            updateCpuMemory() {
                const that = this
                console.log(that.podParam.join(","))
                let _data = {
                    curl: $themeConfig.app.projectHttpUrl + '/monitor/getContainersCpuUsage/' + this.$store.state.myRequest.projectId,
                    pods: that.podParam.join(",")
                }
                let myCount = 0
                that.cpuSeries = []
                that.cpuX = []
                that.memerySeries = []
                that.$store.dispatch('httpGet', _data).then(function (res) {
                    if (res.code === 20216) {
                        let tmpData = res.data.data.result
                        tmpData.forEach(function (e) {
                            let tmpLine = {
                                name: e.metric.pod,
                                type: 'line',
                                showSymbol: false,
                                data: []
                            }

                            e.values.forEach(function (v) {
                                if (myCount === 0) {
                                    let timeStamp = v[0] * 1000
                                    let dt = new Date(timeStamp)
                                    that.cpuX.push(dt.getHours() + ':' + dt.getMinutes())
                                }
                                tmpLine.data.push((v[1]))
                            })
                            that.cpuSeries.push(tmpLine)
                            myCount = 1
                        })
                    }
                })

                let memoryData = {
                    curl: $themeConfig.app.projectHttpUrl + '/monitor/getContainersMemoryUsage/' + this.$store.state.myRequest.projectId,
                    pods: that.podParam.join(",")
                }
                that.$store.dispatch('httpGet', memoryData).then(function (res) {

                    if (res.code === 20216) {
                        let tmpData = res.data.data.result

                        tmpData.forEach(function (e) {
                            let tmpLine = {
                                name: e.metric.pod,
                                type: 'line',
                                showSymbol: false,
                                data: []
                            }

                            e.values.forEach(function (v) {
                                tmpLine.data.push((v[1] / 1024 / 1024).toFixed(0))
                            })
                            that.memerySeries.push(tmpLine)
                        })
                    }
                })
            },

            projectPod() {
                let that = this
                let _data = {
                    curl: $themeConfig.app.projectHttpUrl + '/pod',
                    project: this.$store.state.myRequest.projectId
                }
                that.$store.dispatch('httpGet', _data).then(function (res) {
                    if (res.flag) {
                        console.log(res.data);
                        that.podList = res.data

                        that.podList = that.podList.filter(function (value) {
                            return value.status === "running"
                        })
                        that.podList.forEach(function (e) {
                            if (that.option.indexOf(e.service) < 0) {
                                that.option.push(e.service)
                                that.projectOptions.push(e)
                            }
                        })
                        that.selected = that.option[0]
                        that.projectId = that.projectOptions[0].service
                    }

                })
            },

            projectTotal() {
                let that = this
                this.$store.commit('getClusterHeader', '')
                let _data = {
                    curl: $themeConfig.app.projectHttpUrl + '/project/viewPanel',
                    projectId: this.$store.state.myRequest.projectId
                }
                that.$store.dispatch('httpGet', _data).then(function (res) {
                    that.serviceNo = res.data.serviceCount
                    that.podNo = res.data.pipelineCount
                })
            },

            warnCount() {
                let that = this
                let _data = {
                    curl: $themeConfig.app.httpUrl + '/alarm/v1.0/tbMonitorLog/alarmLevelCount/' + this.$store.state.myRequest.projectId,
                }
                that.$store.dispatch('httpGet', _data).then(function (res) {
                    const tmpData = res.data

                    for (var i = 0; i < tmpData.length; i++) {
                        if (tmpData[i].alarmLevel === '0') that.level0 = tmpData[i].scopeCount

                        if (tmpData[i].alarmLevel === '1') that.level1 = tmpData[i].scopeCount

                        if (tmpData[i].alarmLevel === '2') that.level2 = tmpData[i].scopeCount
                    }
                })
            }
        },
    }
</script>
<style lang="scss">
    @import '~@core/scss/vue/libs/vue-select.scss';

    .card-body {
        position: relative;

        .pie-text {
            width: 105px;
            position: absolute;
            margin: auto;
            left: 0;
            right: 0;
            top: 40%;
            bottom: 0;
        }
    }

    // 更改
    .analyticsFlex {
        .card-body {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;

            .match-height {
                width: 100%;
            }
        }
    }

    .rowBg {
        background-color: #fff;
        // padding: 20px;
        margin: 0;
        // border-radius: 5px;
    }

    // #dashboard-analytics .examplesTable tbody tr td{
    // 	display: inline-block;
    // 	width: 50%
    // }
    #dashboard-analytics .id_text {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

</style>
