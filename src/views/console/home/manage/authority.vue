<template>
  <b-card no-body>

    <div class="m-2">
      <!-- Table Top -->
      <b-row>
        <b-col md="8">
          <b-button variant="primary" @click="addEvent({})">
            <i class="el-icon-plus"/>
            新增
          </b-button>
        </b-col>
      </b-row>
    </div>

    <vxe-table border highlight-hover-row :tree-config="{children: 'children', accordion: true}" :data="tableData">
      <vxe-column field="sourceName" title="权限名称" tree-node></vxe-column>
      <vxe-column field="sourceUrl" title="路由"></vxe-column>
      <vxe-column field="type" title="类型" :formatter="formatType"></vxe-column>
      <vxe-column field="deleteFlag" title="状态" :formatter="formatDeleteFlag"></vxe-column>
      <vxe-column title="操作" show-overflow>
        <template #default="{ row }">
          <feather-icon icon="PlusSquareIcon" size="16" class="mx-1" @click="addEvent({},row.id)" v-b-tooltip.hover title="新增" />
          <feather-icon icon="EditIcon" size="16" class="mx-1" @click="editEvent(row)" v-b-tooltip.hover title="编辑" />
          <feather-icon icon="TrashIcon" size="16" class="mx-1" @click="removeEvent(row)" v-b-tooltip.hover title="删除" />
        </template>
      </vxe-column>
    </vxe-table>

    <div>
      <el-dialog @close="closeDialog" title="资源信息" :visible.sync="dialogFormVisible" width="500px">
        <el-form ref="form" :model="form" style="width: 100%">
          <el-form-item label="资源编号:" :label-width="formLabelWidth">
            <el-input v-model="form.sourceSign" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="资源名称:" :label-width="formLabelWidth">
            <el-input v-model="form.sourceName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="父级资源:" :label-width="formLabelWidth" style="text-align: left;">
            <el-select v-model="form.parentId" placeholder="请选择">
              <el-option label="" value=""/>
              <el-option v-for="item in sourceList" :key="item.id" :label="item.sourceName" :value="item.id"/>
            </el-select>
          </el-form-item>

          <el-form-item label="路由:" :label-width="formLabelWidth">
            <el-input v-model="form.sourceUrl" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="类型:" :label-width="formLabelWidth" style="text-align: left;">
            <el-select v-model="form.type" placeholder="请选择">
              <el-option label="菜单" value="0"/>
              <el-option label="其他" value="1"/>
            </el-select>
          </el-form-item>
          <el-form-item label="删除标记:" :label-width="formLabelWidth" style="text-align: left;">
            <el-select v-model="form.deleteFlag" placeholder="请选择">
              <el-option label="是" :value="true">是</el-option>
              <el-option label="否" :value="false">否</el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSave">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </b-card>
</template>
<script>
import { $themeConfig } from '@themeConfig'

export default {
  data() {
    return {
      tableData: [],
      sourceList: [],
      formLabelWidth: '80px',
      dialogFormVisible: false,
      form: {}
    }
  },
  created() {
    this.getProjectSource()
  },
  methods: {
    editEvent(row) {
      this.form = row
      this.dialogFormVisible = true
    },
    addEvent(row, parentId) {
      this.form = row
      this.dialogFormVisible = true
      if (parentId) {
        this.form.parentId = parentId
      }
    },
    getTrees(list, parent_id = 0) {
      let parentObj = {}
      list.forEach(o => {
        parentObj[o.id] = o
      })
      if (!parent_id) {
        return list.filter(o => !parentObj[o.parentId]).map(o => (o.children = this.getTrees(list, o.id), o))
      } else {
        return list.filter(o => o.parentId == parent_id).map(o => (o.children = this.getTrees(list, o.id), o))
      }
    },
    closeDialog() {
      this.form = {}
      this.dialogFormVisible = false
    },
    handleSave() {
      const that = this
      this.form.curl = $themeConfig.app.userHttpUrl + '/project/source/add'
      this.form.projectId = 'eos-system'
      that.$store.dispatch('httpPost', this.form).then(function (res) {
        that.dialogFormVisible = false
        that.getProjectSource()
        that.form = {}
      })
    },
    removeEvent(row) {
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        let that = this
        let _data = {
          curl: $themeConfig.app.userHttpUrl + '/project/deleteSource',
          sourceIds: row.id,
        }

        that.$store.dispatch('httpGet', _data).then(function (res) {
          that.dialogFormVisible = false
          that.getProjectSource()
          that.form = {}
        })
      })
    },
    getProjectSource() {
      let that = this
      let _data = {
        curl: $themeConfig.app.userHttpUrl + '/project/sourcelist',
        projectId: 'eos-system',
      }
      that.$store.dispatch('httpPost', _data).then(function (res) {
        that.sourceList = res.data
        that.tableData = that.getTrees(res.data)
      })
    },
    formatType({ cellValue }) {
      return cellValue === '0' ? '菜单' : '其他'
    },
    formatDeleteFlag({ cellValue }) {
      return cellValue ? '已失效' : '正常'
    }
  },
}
</script>
<style scoped>
  .el-select {
    display: block !important;
  }
</style>
