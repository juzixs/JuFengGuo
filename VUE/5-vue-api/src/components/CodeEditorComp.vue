<template>
  <div class="code-editor">
    有个小问题，代码自动提示（cursorActivity）打开后，删除关键字需要选中整个，不能单独删除一个关键字的字母
    <p>
      并且，格式化代码后，不能直接修改code值，因为这里model绑定的原因。可以参考CodeEditorComp1组件中，vue-codemirror-lite组件是怎么封装并修改的数据
    </p>
    <div class="cm-container">
      <textarea class="codesql" ref="mycode" v-model="code"></textarea>
    </div>
    <el-button @click="sqlFormatterHandle">SQL格式化</el-button>
  </div>
</template>

<script>
// SQL编辑器
import "codemirror/theme/ambiance.css";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/hint/show-hint.css";
let CodeMirror = require("codemirror/lib/codemirror");
require("codemirror/addon/edit/matchbrackets");
require("codemirror/addon/selection/active-line");
require("codemirror/mode/sql/sql");
require("codemirror/addon/hint/show-hint");
require("codemirror/addon/hint/sql-hint");
// sql格式化
import { format as sqlFormatter } from "sql-formatter"; 

const { log } = console;
export default {
  name: "CodeEditorComp",
  data() {
    return {
      code: "SELECT * FROM guojufengsTable WHERE dt='2021-06-09'",
    };
  },
  mounted() {
    /* codemirror */
    let mime = "text/x-sql"; // text/x-mysql, text/x-mariadb, text/x-cassandra, text/x-plsql, text/x-mssql, text/x-hive, text/x-pgsql, text/x-gql, text/x-gpsql. text/x-esper
    let theme = "ambiance"; //设置主题，不设置的会使用默认主题
    let editor = CodeMirror.fromTextArea(this.$refs.mycode, {
      mode: mime, // 选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可: https://codemirror.net/mode/
      indentWithTabs: true,
      smartIndent: true,
      lineNumbers: true,
      matchBrackets: true,
      // theme: theme,
      autofocus: true,
      extraKeys: { Ctrl: "autocomplete" }, //自定义快捷键
      //自定义提示选项
      // hintOptions: {
      //   tables: {
      //     users: ["name", "score", "birthDate"],
      //     countries: ["name", "population", "size"],
      //   },
      // },
    });

    //代码自动提示功能，记住使用cursorActivity事件不要使用change事件，这是一个坑，那样页面直接会卡死
    editor.on("cursorActivity", function () {
      editor.showHint();
    });
  },
  methods: {
    sqlFormatterHandle() {
      console.log(sqlFormatter)
      const sqlvalue = sqlFormatter(this.code);
      console.log("sqlvalue:", sqlvalue);
      this.code = sqlvalue
    },
  },
};
</script>

<style >
.codesql {
  height: 200px;
  width: 600px;
  font-size: 11pt;
  font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono,
    DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
}
.cm-container {
  border: #ddd solid 1px;
  margin-bottom: 10px;
}
</style>