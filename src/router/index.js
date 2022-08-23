import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 解决报错
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
// push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
return originalPush.call(this, location).catch(err => err)
}
// replace
VueRouter.prototype.replace = function push (location, onResolve, onReject) {
if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
return originalReplace.call(this, location).catch(err => err)
}


const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior() {
        return {
            x: 0,
            y: 0
        }
    },
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/Login.vue'),
            meta: {
                layout: 'full'
            }
        },
        {
            path: '/project/logs',
            name: 'logs',
            component: () => import('@/views/console/project/application/pods/LoadLogs.vue'),
            meta: {
                layout: 'full'
            }
        },
        {
            path: '/pipeline/logs',
            name: 'PipelineLogs',
            component: () => import('@/views/console/project/application/pipeline/PipelineLogs'),
            meta: {
                layout: 'full'
            }
        },
        {
            path: '/home',
            name: 'home',
            component: () => import('@/views/home/home/Home.vue'),
            meta: {
                layout: 'full'
            }
        },
        {
            path: '/ssoLogin',
            name: 'ssoLogin',
            component: () => import('@/views/ssoLogin.vue'),
            meta: {
                layout: 'full'
            }
        },
        {
            path: '/',
            name: 'index',
            component: () => import('@/views/index.vue'),
            redirect: '/index',
            meta: {
                layout: 'full'
            },
            children: [
                {
                    path: '/index',
                    name: 'describe',
                    component: () => import('@/views/home/home/index/describe.vue'),
                    meta: {
                        layout: 'full'
                    }
                },
                {
                    path: '/api/describe',
                    name: '详情页',
                    component: () => import('@/views/home/api/describeApi.vue'),
                    meta: {
                        layout: 'full'
                    }
                },
                {
                    path: '/apaas',
                    name: 'apaas',
                    component: () => import('@/views/home/apaas/index.vue'),
                    meta: {
                        layout: 'full'
                    }
                },
                {
                    path: '/api',
                    name: 'api',
                    component: () => import('@/views/home/api'),
                    meta: {
                        layout: 'full'
                    }
                },
                {
                    path: '/testLogin',
                    name: 'login111',
                    component: () => import('@/views/Login.vue'),
                    meta: {
                        layout: 'full'
                    }
                },
                {
                    path: '/help',
                    name: 'help',
                    component: () => import('@/views/console/home/help/help.vue'),
                    meta: {
                        layout: 'full'
                    }
                }
            ]
        },
        {
            path: '/promanage',
            name: 'projec-index',
            component: () => import('@/views/console/home/project-index.vue'),
            redirect: '/workplace',
            meta: {
                layout: 'full'
            },
            children: [
                {
                    path: '/workplace',
                    name: 'workplace',
                    component: () => import('@/views/console/home/workplace.vue'),
                    meta: {
                        layout: 'full'
                    }
                },
                {
                    path: '/console/help',
                    name: 'consoleHelp',
                    component: () => import('@/views/console/home/help/help.vue'),
                    meta: {
                        layout: 'full'
                    }
                },
            ]
        },
        {
            path: '/manage',
            name: 'manage',
            component: () => import('@/views/console/home/project-index.vue'),
            redirect: '/manage/account/employee',
            meta: {
                layout: 'full'
            },
            children: [
                {
                    path: '/manageLayout',
                    name: 'manageLayout',
                    component: () => import('@/views/console/home/manage/manageLayout.vue'),
                    meta: {
                        layout: 'full'
                    },
                    children: [
                        {
                            path: '/manage/auth',
                            name: 'manageAuthority',
                            component: () => import('@/views/console/home/manage/authority.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/manage/role',
                            name: 'manageRole',
                            component: () => import('@/views/console/home/manage/ProjectRole.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/manage/account/employee/',
                            name: 'employee',
                            component: () => import('@/views/console/home/manage/account/employee.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/manage/account/application',
                            name: 'applicationAccount',
                            component: () => import('@/views/console/home/manage/account/application.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/manage/notice',
                            name: 'notice',
                            component: () => import('@/views/console/home/manage/notice.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/manage/module',
                            name: 'eosModule',
                            component: () => import('@/views/console/home/manage/module.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/manage/apaas/apaasMaintain',
                            name: 'apaasMaintain',
                            component: () => import('@/views/console/home/manage/apaas/apaasMaintain.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/manage/apaas/apaasApprove',
                            name: 'apaasApprove',
                            component: () => import('@/views/console/home/manage/apaas/apaasApprove.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/manage/apaas/manageIframe',
                            name: 'manageIframe',
                            component: () => import('@/views/console/home/manage/apaas/manageIframe.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/manage/cluster',
                            name: 'cluster',
                            component: () => import('@/views/console/home/manage/cluster.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/manage/module',
                            name: 'eosModule',
                            component: () => import('@/views/console/home/manage/module.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/manage/apaas/apaasMaintain',
                            name: 'apaasMaintain',
                            component: () => import('@/views/console/home/manage/apaas/apaasMaintain.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/manage/apaas/apaasApprove',
                            name: 'apaasApprove',
                            component: () => import('@/views/console/home/manage/apaas/apaasApprove.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/manage/approve',
                            name: 'manageApprove',
                            component: () => import('@/views/console/home/manage/authority.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/manage/monitor/pod',
                            name: 'podMonitor',
                            component: () => import('@/views/console/home/manage/monitor/pod.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/manage/monitor/server',
                            name: 'serverMonitor',
                            component: () => import('@/views/console/home/manage/monitor/server.vue'),
                            meta: {
                                layout: 'full'
                            }
                        }
                    ]
                }
            ]
        },
        {
            path: '/project',
            name: 'project',
            component: () => import('@/views/console/project/project.vue'),
            redirect: '/project/dashboard',
            meta: {
                layout: 'full'
            },
            children: [
                {
                    path: '/proLayout',
                    name: 'proLayout',
                    component: () => import('@/views/console/project/projectLayout.vue'),
                    meta: {
                        layout: 'full'
                    },
                    children: [
                        {
                            path: '/project/dashboard',
                            name: 'dashboard',
                            component: () => import('@/views/console/project/application/dashboard/analytics.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/project/service',
                            name: 'service',
                            component: () => import('@/views/console/project/application/service/service.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/project/pipeline',
                            name: 'pipeline',
                            component: () => import('@/views/console/project/application/pipeline/pipeline.vue'),
                            meta: {
                                layout: 'full',
                                keepAlive: true
                            }
                        },
                        {
                            path: '/project/pipeline/details',
                            name: 'pipelineDetails',
                            component: () => import('@/views/console/project/application/pipeline/pipelineDetail.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/project/pipeline/build',
                            name: 'pipelineBuild',
                            component: () => import('@/views/console/project/application/pipeline/pipelineBuild.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/project/yamlTemplate',
                            name: 'yamlTemplate',
                            component: () => import('@/views/console/project/application/yamlTemplate/yamlTemplate.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/project/pod',
                            name: 'pod',
                            component: () => import('@/views/console/project/application/pods/PodView.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/project/canary',
                            name: 'canary',
                            component: () => import('@/views/console/project/application/canary/canary.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/project/report',
                            name: 'projectReport',
                            component: () => import('@/views/console/project/application/report/report.vue'),
                            meta: {
                                layout: 'full',
                                keepAlive: true
                            }
                        },
                        {
                            path: '/project/report/detail',
                            name: 'projectReport',
                            component: () => import('@/views/console/project/application/report/detail.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/project/job/manage',
                            name: 'jobManage',
                            component: () => import('@/views/console/project/application/job/manage.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/project/job/log',
                            name: 'jobLog',
                            component: () => import('@/views/console/project/application/job/log.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        // ipaas
                        {
                            path: '/api/dashboard',
                            name: 'apiDashboard',
                            component: () => import('@/views/console/project/api/dashboard/api-dashboard.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/api/datasource',
                            name: 'apiDatasource',
                            component: () => import('@/views/console/project/api/factory/datasource/api-datasource.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/api/manage',
                            name: 'apiManage',
                            component: () => import('@/views/console/project/api/factory/manage/api-manage.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/api/my',
                            name: 'apiMy',
                            component: () => import('@/views/console/project/api/store/my/api-my.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/api/account',
                            name: 'myAppAccount',
                            component: () => import('@/views/console/project/api/store/account/application-account.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/api/log',
                            name: 'apiLog',
                            component: () => import('@/views/console/project/api/log/api-log.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        //提供者访问日志
                        {
                            path: '/api/factory/log',
                            name: 'apiFactoryLog',
                            component: () => import('@/views/console/project/api/factory/log/access-log.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        //使用者访问日志
                        {
                            path: '/api/store/log',
                            name: 'apiStoreLog',
                            component: () => import('@/views/console/project/api/store/log/access-log.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/api/auth',
                            name: 'apiAuth',
                            component: () => import('@/views/console/project/api/factory/auth/api-auth.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/api/project/apis',
                            name: 'projectApi',
                            component: () => import('@/views/console/project/api/factory/auth/permission/ProjectApiList.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/api/project/account',
                            name: 'projectAccount',
                            component: () => import('@/views/console/project/api/factory/auth/permission/ProjectAccount.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/api/project/roles',
                            name: 'projectrole',
                            component: () => import('@/views/console/project/api/factory/auth/permission/ProjectRole.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        // (租户)管理
                        {
                            path: '/project/warnmsg',
                            name: 'warnmsg',
                            component: () => import('@/views/console/project/manage/monitor/WarnMessage.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                        {
                            path: '/project/monitorConfig',
                            name: 'monitorConfig',
                            component: () => import('@/views/console/project/manage/monitor/monitorConfiguration.vue'),
                            meta: {
                                layout: 'full',
                                keepAlive: true
                            }
                        },
                        {
                            path: '/project/skywalking',
                            name: 'skywalking',
                            component: () => import('@/views/console/project/manage/monitor/skywalking.vue'),
                            meta: {
                                layout: 'full',
                                keepAlive: true
                            }
                        },
						{
						    path: '/cmdb/dns',
						    name: 'cmdbdns',
						    component: () => import('@/views/console/project/application/cmdb/cmdbDns.vue'),
						    meta: {
						        layout: 'full'
						    }
						},
                        {
                            path: '/manage/tenant/user',
                            name: 'tenantuser',
                            component: () => import('@/views/console/project/manage/auth/member.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },

                        {
                            path: '/error/404',
                            name: '404',
                            component: () => import('@/views/console/project/error/404.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },

                        {
                            path: '/manage/tenant/role',
                            name: 'tenantrole',
                            component: () => import('@/views/console/project/manage/auth/role.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                    ]
                },

                {
                    path: '/apaasLayout',
                    name: 'apaasLayout',
                    component: () => import('@/views/console/project/apaas/apaasLayout.vue'),
                    redirect: '/apaas/index',
                    meta: {
                        layout: 'full'
                    },
                    children: [
                        {
                            path: '/apaas/index',
                            name: 'apaasIndex',
                            component: () => import('@/views/console/project/apaas/apaas.vue'),
                            meta: {
                                layout: 'full'
                            },
                        },
                        {
                            path: '/apaas/mod',
                            name: 'apaasMod',
                            component: () => import('@/views/console/project/apaas/modIframe.vue'),
                            meta: {
                                layout: 'full'
                            },
                        },
                        {
                            path: '/apaas/mod',
                            name: 'modelApply',
                            component: () => import('@/views/console/project/apaas/modelManagementApply.vue'),
                            meta: {
                                layout: 'full'
                            },
                        },
                        {
                            path: '/apaas/mod',
                            name: 'modelApplyStatus',
                            component: () => import('@/views/console/project/apaas/appsApplyStatus.vue'),
                            meta: {
                                layout: 'full'
                            },
                        },
						// {
						//     path: '/apaas/index',
						//     name: 'apaasMod',
						//     component: () => import('@/views/console/project/apaas/modIframe.vue'),
						//     meta: {
						//         layout: 'full'
						//     },
						// },
                        {
                            path: '/apaasNotRegister',
                            name: 'apaasNotRegister',
                            component: () => import('@/views/console/project/apaas/apaasNotRegister.vue'),
                            meta: {
                                layout: 'full'
                            }
                        },
                    ]
                },
            ]
        },
        {
            path: '/error-404',
            name: 'error-404',
            component: () => import('@/views/error/Error404.vue'),
            meta: {
                layout: 'full'
            }
        },
        {
            path: '*',
            redirect: 'error-404'
        }
    ]
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
    // Remove initial loading
    const appLoading = document.getElementById('loading-bg')
    if (appLoading) {
        appLoading.style.display = 'none'
    }
})

export default router
