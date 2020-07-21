@@ -1,85 +0,0 @@
<template>
<el-form label-width="80px">
  <el-form-item label="允许访问服务">
    <el-select v-model="clients" multiple filterable remote placeholder="请输入服务关键词" :remote-method="remoteMethod" :loading="loading">
      <el-option v-for="item in items" :key="item.id" :label="item.name" :value="item.id"> </el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" v-if="serviceManager_btn_clientManager" @click="onSubmit">保存</el-button>
  </el-form-item>
</el-form>
</template>

<script>
import {
  page,
  getClients,
  modifyClients
} from '@/api/auth/service/index'
import { mapGetters } from 'vuex'
export default {
  props: {
    serviceId: {
      default: '1'
    }
  },
  data () {
    return {
      items: [],
      clients: [],
      list: [],
      loading: false,
      serviceManager_btn_clientManager: false
    }
  },
  created () {
    this.initClients()
    this.serviceManager_btn_clientManager = this.hasPermissions(['serviceManager:btn_clientManager'])
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        page({
          name: query
        }).then(response => {
          this.items = response.rows
          this.total = response.total
          this.loading = false
        })
      } else {
        this.items = []
      }
    },
    onSubmit () {
      const vals = {}
      if (this.clients.length > 0) vals.clients = this.clients.join()
      modifyClients(this.serviceId, vals).then(() => {
        this.$emit('closeClientDialog')
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    initClients () {
      getClients(this.serviceId).then(response => {
        this.items = response.data
        const leas = []
        for (let i = 0; i < response.length; i++) {
          leas.push(response.data[i].id)
        }
        this.clients = leas
      })
    }
  }
}
</script>
