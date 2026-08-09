export function loadReportChartModules() {
	return Promise.all([
		import('echarts/core'),
		import('echarts/charts'),
		import('echarts/components'),
		import('echarts/renderers')
	]);
}
