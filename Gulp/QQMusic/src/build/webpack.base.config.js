const webpack=require('webpack');
const path=require('path');
const glob=require('glob');
const config=require('../config/index');
const stylish=require('eslint/lib/formatters/stylish');
//global variable
const providePlugin=new webpack.ProvidePlugin({
	$:'jquery'
});
//glob for multi-entries
const entries=(src)=>{
	const entryFiles=glob.sync(src);
	const map={};
	const len=entryFiles.length;
	for(let i=0;i<len;i++){
		let filePath=entryFiles[i];
		let fileName=filePath.substring(filePath.lastIndexOf('\/')+1,filePath.lastIndexOf('.'));
		map[fileName]=filePath;
	}
	return map;
}
//commonChunksPluginArray
const entryCommonChunksArray=(defaultLibArray)=>{
	const configPushCommonChunksArray=config.base.commonChunks;
	if(configPushCommonChunksArray.length===0){
		return defaultLibArray;
	}else{
		const newDefaultLibArray=defaultLibArray.concat(configPushCommonChunksArray);
		return newDefaultLibArray;
	}	
}
//commonChunksPlugin config
const commonsChunk=new webpack.optimize.CommonsChunkPlugin({
	name:'common',
	filename:'../common/common.js',
	minchunks:2
});
module.exports={
	entry:Object.assign(entries('../src/js/conf/*.js'),{
		'common': entryCommonChunksArray(['jquery'])
	}),
	output:{
		path:path.join(__dirname,'../dist/js/conf'),
		filename:'[name].js'
	},
	resolve: {
        extensions: ['.js', '.vue','.scss','.css','.pug','.html','.json'],
        alias: {
		    '@pcjs': path.resolve(__dirname, '../node_modules/element-ui/pc-widget/src/js/common/mods'),
			'@mjs': path.resolve(__dirname, '../node_modules/element-ui/m-widget/src/js/common/mods'),
			'@utilsjs': path.resolve(__dirname, '../node_modules/element-ui/utils/src/js/common/mods'),
			'@yiframesjs': path.resolve(__dirname, '../node_modules/element-ui/yiframes/src/js/common/mods'),
			'@jsbridge': path.resolve(__dirname, '../node_modules/element-ui/yiframesjsbridge/src/js/common/mods')
		}
    },
    module:{
    	rules:[
    		{
    			enforce: 'pre',
		        test: /\.js$/,
		        include:/(common|conf|element-js)/,
		        use: [
			        {
			          loader:'eslint-loader',
			          options:{
			        	emitWarning:true,
			        	// default value 
          				formatter: stylish,
          				configFile: path.resolve('../src/config/eslintrc.js'),
			          }
			        }
		        ]
		    },
    		{
		        test: /\.js$/,
		        include:/(common|conf|element-js)/,
		        use:[
			        {
				        loader:'babel-loader',
				        options:{
		          			presets: ['env'],
		          			plugins: ["transform-runtime"]
				        }
				    }
		        ]
		    },
		    {
	            test: /\.js$/,
	            enforce: 'post', // post-loader处理
	            loader: 'es3ify-loader'
	        }
    	]
    },
	plugins: [
	    providePlugin,
	    commonsChunk
	]
}