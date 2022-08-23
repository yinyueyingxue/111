<template>
    <div class="misc-wrapper">
        <div class="misc-inner p-2 p-sm-3">
            <div class="w-100 text-center">
                <h2 class="mb-1">
                    未开通apaas，请联系管理员申请开通
                </h2>
                <b-img
                        fluid
                        :src="imgUrl"
                        alt="Error page"
                />
            </div>
        </div>
    </div>
</template>

<script>
    /* eslint-disable global-require */
    import {BLink, BButton, BImg} from 'bootstrap-vue'
    import VuexyLogo from '@core/layouts/components/Logo.vue'
    import store from '@/store/index'

    export default {
        components: {
            VuexyLogo,
            BLink,
            BButton,
            BImg,
        },
        data() {
            return {
                downImg: require('@/assets/images/pages/error.svg'),
            }
        },
        computed: {
            imgUrl() {
                if (store.state.appConfig.layout.skin === 'dark') {
                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    this.downImg = require('@/assets/images/pages/calendar-illustration.png')
                    return this.downImg
                }
                return this.downImg
            },
        },
        methods: {
        }
    }
</script>

<style lang="scss">
    @import '@core/scss/vue/pages/page-misc.scss';
</style>

