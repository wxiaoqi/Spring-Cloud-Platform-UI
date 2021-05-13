<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="资源名称" v-model="listQuery.name" size="mini"> </el-input>
      <el-button class="filter-item" type="primary" icon="search" size="mini" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="menuManager_btn_element_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit" size="mini">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="id" width="65">
        <template slot-scope="scope" >
          <span>{{scope.row.id}}</span>
</template>

</el-table-column>
    <el-table-column width="200px" align="center" label="资源编码"><template slot-scope="scope" >
  <span>
    {{scope.row.code}}</span>
</template>

</el-table-column>
    <el-table-column width="200px" align="center" label="资源类型"><template slot-scope="scope" >
  <span>
    {{scope.row.type}}</span>
</template>

</el-table-column>
    <el-table-column width="200px" align="center" label="资源名称"><template slot-scope="scope" >
  <span>
    {{scope.row.name}}</span>
</template>

</el-table-column>
    <el-table-column width="200px" align="center" label="资源地址"><template slot-scope="scope" >
  <span>
    {{scope.row.uri}}</span>
</template>
</el-table-column>
    <el-table-column width="200px" align="center" label="资源请求类型"><template slot-scope="scope" >
  <span>
    {{scope.row.method}}</span>
</template>

</el-table-column>
    <el-table-column width="200px" align="center" label="描述"><template slot-scope="scope" >
  <span>
    {{scope.row.description}}</span>
</template>

</el-table-column>
    <el-table-column fixed="right" align="center" label="操作" width="150"><template slot-scope="scope" >
  <el-button v-if="menuManager_btn_element_edit" size="small" type="success" @click="handleUpdate(scope.row)">
    编辑
  </el-button>
  <el-button v-if="menuManager_btn_element_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
  </el-button>
</template>

</el-table-column>
  </el-table>
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="资源编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入资源编码"></el-input>
      </el-form-item>
      <el-form-item label="资源类型" prop="type">
         <el-select class="filter-item" v-model="form.type" placeholder="请输入资源类型">
          <el-option v-for="item in  typeOptions" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资源名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入资源名称"></el-input>
      </el-form-item>
      <el-form-item label="资源地址" prop="uri">
        <el-input v-model="form.uri" placeholder="请输入资源地址"></el-input>
      </el-form-item>
      <el-form-item label="资源请求类型" prop="method">
        <el-select class="filter-item" v-model="form.method" placeholder="请输入资源请求类型">
          <el-option v-for="item in  methodOptions" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
      <el-button v-else type="primary" @click="update('form')">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  page,
  addObj,
  getObj,
  delObj,
  putObj
} from '@/api/admin/element/index'
import { mapGetters } from 'vuex'
export default {
  // name: 'element',
  // props: {
  //   menuId: {
  //     default: '1'
  //   }
  // },
  data () {
    return {
      methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
      typeOptions: ['uri', 'button'],
      form: {
        code: undefined,
        type: undefined,
        name: undefined,
        uri: undefined,
        menuId: undefined,
        method: undefined,
        description: undefined
      },
      rules: {
        code: [{
          required: true,
          message: '请输入资源编码',
          trigger: 'blur'
        }
        ],
        type: [{
          required: true,
          message: '请输入资源类型',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 20,
          message: '长度在 2 到 20 个字符',
          trigger: 'blur'
        }
        ],
        name: [{
          required: true,
          message: '请输入资源名称',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 20,
          message: '长度在 2 到 20 个字符',
          trigger: 'blur'
        }
        ],
        uri: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 20,
          message: '长度在 3 到 20 个字符',
          trigger: 'blur'
        }
        ],
        method: [{
          required: true,
          message: '请输入资源请求类型',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 20,
          message: '长度在 3 到 20 个字符',
          trigger: 'blur'
        }
        ],
        description: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 20,
          message: '长度在 3 到 20 个字符',
          trigger: 'blur'
        }
        ]
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        menuId: this.menuId
      },
      dialogFormVisible: false,
      dialogStatus: '',
      menuManager_btn_element_add: false,
      menuManager_btn_element_edit: false,
      menuManager_btn_element_del: false,
      menuId: -1,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created () {
    this.getList()
    this.menuManager_btn_element_add = this.hasPermissions(['menuManager:btn_element_add'])
    this.menuManager_btn_element_del = this.hasPermissions(['menuManager:btn_element_del'])
    this.menuManager_btn_element_edit = this.hasPermissions(['menuManager:btn_element_edit'])
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList () {
      this.listLoading = true
      this.listQuery.menuId = this.menuId
      page(this.listQuery).then(response => {
        this.list = response.rows
        this.total = response.total
        this.listLoading = false
      })
    },
    handleFilter () {
      this.getList()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate (row) {
      getObj(row.id).then(response => {
        this.form = response
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    handleDelete (row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(row.id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
      })
    },
    create (formName) {
      const set = this.$refs
      this.form.menuId = this.menuId
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    cancel (formName) {
      this.dialogFormVisible = false
      const set = this.$refs
      set[formName].resetFields()
    },
    update (formName) {
      const set = this.$refs
      this.form.menuId = this.menuId
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          this.form.password = undefined
          putObj(this.form.id, this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    resetTemp () {
      this.form = {
        code: undefined,
        type: undefined,
        name: undefined,
        uri: undefined,
        menuId: undefined,
        method: undefined,
        description: undefined
      }
    }
  }
}
</script>
