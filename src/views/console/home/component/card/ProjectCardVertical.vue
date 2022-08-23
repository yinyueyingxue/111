<template>
    <b-card no-body>
        <template v-slot:header>
            <h4 class="font-weight-bolder">{{ projectName }}</h4>
            <b-avatar-group v-if="superAdmin">
                <div  @click.stop="showParentEditModal">
                    <b-avatar variant="light-primary">
                        <feather-icon size="20" icon="EditIcon" />
                    </b-avatar>
                </div>
                <div @click.stop="deleteProject">
                    <b-avatar variant="light-danger">
                        <feather-icon size="20" icon="Trash2Icon" />
                    </b-avatar>
                </div>
            </b-avatar-group>
        </template>
        <b-card-body class="d-flex">
            <div style="width: 20%">
                <b-avatar class="mb-3" :variant="`light-${color}`" size="45">
                    <feather-icon size="45" :icon="icon" />
                </b-avatar>
            </div>
            <b-col class="d-flex flex-column align-items-start">
                <b-row>
                    <b-col>
                        <small class="text-muted mr-50">租户ID：</small>
                        <small class="text-body font-weight-bolder">{{ projectId }}</small>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <small class="text-muted mr-50">管理员：</small>
                        <small class="text-body">{{ defenderName+' '+defender }}</small>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <small class="text-muted mr-50">创建时间：</small>
                        <small class="text-body">{{ createTime ? createTime.split(' ')[0] : '--' }}</small>
                       <!-- <small class="text-body">{{  createTime }}</small> -->
                    </b-col>
                </b-row>
               <b-row>
                    <b-col>
                        <small class="text-muted mr-50">服务数量：</small>
                        <small class="text-body">{{ serviceCount }}</small>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <small class="text-muted mr-50">实例数量：</small>
                        <small class="text-body">{{ podCount }}</small>
                    </b-col>
                </b-row>
               <!-- <b-row>
                    <b-col>
                        <small class="text-muted mr-50">更新时间：</small>
                        <small class="text-body">{{ updateTime ? updateTime.split(' ')[0] : '--' }}</small>
                        <small class="text-body">{{ updateTime }}</small>
                    </b-col>
                </b-row> -->
            </b-col>
        </b-card-body>
    </b-card>
</template>
<script>
    import {BCard, BAvatar, BAvatarGroup} from 'bootstrap-vue'

    export default {
        components: {
            BCard,
            BAvatar,
            BAvatarGroup
        },
        props: {
            icon: {
                type: String,
                default: 'GitlabIcon',
            },
            color: {
                type: String,
                default: 'primary',
            },
            projectId: {
                type: [Number, String],
                required: true,
            },
            projectName: {
                type: String,
                default: '',
            },
            defender: {
                type: String,
                default: '',
            },
            defenderName: {
                type: String,
                default: '',
            },
            createTime: {
                type: String,
                default: '',
            },
            updateTime: {
                type: String,
                default: '',
            },
            projectForm: {
                type: Object,
                default: {}
            },
            superAdmin: {
                type: Boolean,
                default: false
            },
            serviceCount: {
                type: [Number, String],
                default: false
            },
            podCount: {
                type: [Number, String],
                default: 0
            }
        },
        methods: {
            showParentEditModal() {
                this.$parent.$parent.showEditModal(2, this.projectForm);
            },
            deleteProject() {
                this.$parent.$parent.removeProject(this.projectId)
            }
        }
    }

</script>
<style lang="scss">
    @import "~@core/scss/base/pages/app-ecommerce.scss";
</style>
