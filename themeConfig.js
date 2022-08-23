// Theme Colors
// Initially this will be blank. Later on when app is initialized we will assign bootstrap colors to this from CSS variables.
export const $themeColors = {}

// App Breakpoints
// Initially this will be blank. Later on when app is initialized we will assign bootstrap breakpoints to this object from CSS variables.
export const $themeBreakpoints = {}

// Base Host
const baseHost = "eos-ts.h3c.com"

// APP CONFIG
export const $themeConfig = {
    app: {
        httpUrl: "//api." + baseHost,
        apaasHttpUrl: "//api." + baseHost + "/paas/v1.0",
        userHttpUrl: "//api." + baseHost + "/user/v1.0",
		apiHttpUrl: "//api." + baseHost + "/api-manage/v1.0",
        logHttpUrl: "//api." + baseHost + "/log/v1.0",
        monitorHttpUrl: "//api." + baseHost + "/alarm/v1.0",
        projectHttpUrl: "//api." + baseHost + "/project/v1.0",
        apaasApiHttpUrl:"//api."+baseHost+"/apaas/v1",
        xxlJobHttpUrl: "https://job." + baseHost,
        apaasDomain: "http://apaas." + baseHost + "/basicServiceManagement",
        grafanaHttpUrl: "https://grafana." + baseHost,
        appName: 'H3C-EOS', // Will update name in navigation menu (Branding)
        // eslint-disable-next-line global-require
        appLogoImage: require('@/assets/images/logo/eos-white.png'), // Will update logo in navigation menu (Branding)
        nacosUrl: "http://nacos." + baseHost + "/nacos/",
        nexusUrl: "http://nexus." + baseHost,
        jenkinsUrl: "http://jenkins." + baseHost,
        rabbitMqUrl: "http://rabbit." + baseHost,
        kibanaUrl: "http://kibana." + baseHost,
        skywalkingUrl: "http://skywalking."+baseHost,
        confluenceUrl: "http://team.eos.h3c.com/",
        orgbaseinfoUrl: "//api." + baseHost + "/orgbaseinfo/v1.0",
    },
    layout: {
        isRTL: false,
        skin: 'light', // light, dark, bordered, semi-dark
        routerTransition: 'zoom-fade', // zoom-fade, slide-fade, fade-bottom, fade, zoom-out, none
        type: 'horizontal', // vertical, horizontal
        contentWidth: 'full', // full, boxed
        menu: {
            hidden: false,
            isCollapsed: false,
        },
        navbar: {
            // ? For horizontal menu, navbar type will work for navMenu type
            type: 'floating', // static , sticky , floating, hidden
            backgroundColor: '#00BBFF', // BS color options [primary, success, etc]
        },
        footer: {
            type: 'static', // static, sticky, hidden
        },
        customizer: true,
        enableScrollToTop: true,
    },
}
