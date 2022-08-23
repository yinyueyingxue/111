export default [

	// {
	// 	title: 'Email',
	// 	route: 'apps-email',
	// 	icon: 'MailIcon',
	// },
	{
		title: '概览',
		route: 'dashboard',
		icon: 'MessageSquareIcon',
	},
	{
		title: '服务',
		route: 'service',
		icon: 'CheckSquareIcon',
	},
	{
		title: 'CI/CD',
		icon: 'CalendarIcon',
		route: '',
		children: [{
				title: '流水线',
				route: 'pipeline',
			},
			{
				title: 'yaml模板',
				route: {
					name: 'yaml',
					params: {
						id: 4987
					}
				},
			}
		],
	},
	{
		title: '服务治理',
		icon: 'ShoppingCartIcon',
		children: [{
				title: '实例管理',
				route: 'apps-e-commerce-shop',
			},
			{
				title: '灰度发布',
				route: {
					name: 'apps-e-commerce-product-details',
					params: {
						slug: 'apple-watch-series-5-27'
					}
				},
			},
		],
	},
	// {
	// 	title: 'User',
	// 	icon: 'UserIcon',
	// 	children: [{
	// 			title: 'List',
	// 			route: 'apps-users-list',
	// 		},
	// 		{
	// 			title: 'View',
	// 			route: {
	// 				name: 'apps-users-view',
	// 				params: {y
	// 					id: 21
	// 				}
	// 			},
	// 		},
	// 		{
	// 			title: 'Edit',
	// 			route: {
	// 				name: 'apps-users-edit',
	// 				params: {
	// 					id: 21
	// 				}
	// 			},
	// 		},
	// 	],
	// },
	// {
	// 	title: 'Pages',
	// 	icon: 'FileIcon',
	// 	children: [{
	// 			title: 'Authentication',
	// 			icon: 'CircleIcon',
	// 			children: [{
	// 					title: 'Login v1',
	// 					route: 'auth-login-v1',
	// 					target: '_blank',
	// 				},
	// 				{
	// 					title: 'Login v2',
	// 					route: 'auth-login-v2',
	// 					target: '_blank',
	// 				},
	// 				{
	// 					title: 'Register v1',
	// 					route: 'auth-register-v1',
	// 					target: '_blank',
	// 				},
	// 				{
	// 					title: 'Register v2',
	// 					route: 'auth-register-v2',
	// 					target: '_blank',
	// 				},
	// 				{
	// 					title: 'Forgot Password v1',
	// 					route: 'auth-forgot-password-v1',
	// 					target: '_blank',
	// 				},
	// 				{
	// 					title: 'Forgot Password v2',
	// 					route: 'auth-forgot-password-v2',
	// 					target: '_blank',
	// 				},
	// 				{
	// 					title: 'Reset Password v1',
	// 					route: 'auth-reset-password-v1',
	// 					target: '_blank',
	// 				},
	// 				{
	// 					title: 'Reset Password v2',
	// 					route: 'auth-reset-password-v2',
	// 					target: '_blank',
	// 				},
	// 			],
	// 		},
			{
				title: '运营报告',
				route: 'pages-account-setting',
			},
			// {
			// 	title: 'Profile',
			// 	route: 'pages-profile',
			// },
			// {
			// 	title: 'Faq',
			// 	route: 'pages-faq',
			// },
			// {
			// 	title: 'Knowledge Base',
			// 	route: 'pages-knowledge-base',
			// },
			// {
			// 	title: 'Pricing',
			// 	route: 'pages-pricing',
			// },
			// {
			// 	title: 'Blog',
			// 	children: [{
			// 			title: 'List',
			// 			route: 'pages-blog-list',
			// 		},
			// 		{
			// 			title: 'Detail',
			// 			route: {
			// 				name: 'pages-blog-detail',
			// 				params: {
			// 					id: 1
			// 				}
			// 			},
			// 		},
			// 		{
			// 			title: 'Edit',
			// 			route: {
			// 				name: 'pages-blog-edit',
			// 				params: {
			// 					id: 1
			// 				}
			// 			},
			// 		},
			// 	],
			// },
			// {
			// 	title: 'Mail Templates',
			// 	children: [{
			// 			title: 'Welcome',
			// 			href: 'https://pixinvent.com/demo/vuexy-mail-template/mail-welcome.html',
			// 		},
			// 		{
			// 			title: 'Reset Password',
			// 			href: 'https://pixinvent.com/demo/vuexy-mail-template/mail-reset-password.html',
			// 		},
			// 		{
			// 			title: 'Verify Email',
			// 			href: 'https://pixinvent.com/demo/vuexy-mail-template/mail-verify-email.html',
			// 		},
			// 		{
			// 			title: 'Deactivate Account',
			// 			href: 'https://pixinvent.com/demo/vuexy-mail-template/mail-deactivate-account.html',
			// 		},
			// 		{
			// 			title: 'Invoice',
			// 			href: 'https://pixinvent.com/demo/vuexy-mail-template/mail-invoice.html',
			// 		},
			// 		{
			// 			title: 'Promotional',
			// 			href: 'https://pixinvent.com/demo/vuexy-mail-template/mail-promotional.html',
			// 		},
			// 	],
			// },
			// {
			// 	title: 'Miscellaneous',
			// 	icon: 'CircleIcon',
			// 	children: [{
			// 			title: 'Coming Soon',
			// 			route: 'misc-coming-soon',
			// 			target: '_blank',
			// 		},
			// 		{
			// 			title: 'Not Authorized',
			// 			route: 'misc-not-authorized',
			// 			target: '_blank',
			// 		},
			// 		{
			// 			title: 'Under Maintenance',
			// 			route: 'misc-under-maintenance',
			// 			target: '_blank',
			// 		},
			// 		{
			// 			title: 'Error',
			// 			route: 'misc-error',
			// 			target: '_blank',
			// 		},
			// 	],
			// },
		// ],
	// },
]
