<template>
<el-form label-width="80px">
  <el-form-item label="群主|领导">
    <el-select v-model="leaders" multiple filterable remote placeholder="请输入关键词" :remote-method="remoteLeaderMethod" :loading="loading">
      <el-option v-for="item in lItems" :key="item.id" :label="item.name" :value="item.id"> </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="组员|下属">
    <el-select v-model="members" multiple filterable remote placeholder="请输入关键词" :remote-method="remoteMemberMethod" :loading="loading">
      <el-option v-for="item in mItems" :key="item.id" :label="item.name" :value="item.id"> </el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" v-if="groupManager_btn_userManager" @click="onSubmit">保存</el-button>
  </el-form-item>
</el-form>
</template>

<script>
import {
  page
} from '@/api/admin/user/index'
import {
  getUsers,
  modifyUsers
} from '@/api/admin/group/index'
import { mapGetters } from 'vuex'
export default {
  props: {
    groupId: {
      default: '1'
    }
  },
  data () {
    return {
      lItems: [],
      mItems: [],
      leaders: [],
      members: [],
      list: [],
      loading: false,
      groupManager_btn_userManager: false
    }
  },
  created () {
    this.initUsers()
    this.groupManager_btn_userManager = this.hasPermissions(['groupManager:btn_userManager'])
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    remoteMemberMethod (query) {
      if (query !== '') {
        this.loading = true
        this.loading = false
        page({
          name: query
        }).then(response => {
          this.mItems = response.rows
          this.total = response.total
          this.loading = false
        })
      } else {
        this.mItems = []
      }
    },
    remoteLeaderMethod (query) {
      if (query !== '') {
        this.loading = true
        this.loading = false
        page({
          name: query
        }).then(response => {
          this.lItems = response.rows
          this.total = response.total
          this.loading = false
        })
      } else {
        this.lItems = []
      }
    },
    onSubmit () {
      const vals = {}
      if (this.members.length > 0) vals.members = this.members.join()
      if (this.leaders.length > 0) vals.leaders = this.leaders.join()
      modifyUsers(this.groupId, vals).then(() => {
        this.$emit('closeUserDialog')
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    initUsers () {
      getUsers(this.groupId).then(response => {
        this.lItems = response.leaders
        this.mItems = response.members
        // eslint-disable-next-line one-var
        const mems = [], leas = []
        for (let i = 0; i < response.members.length; i++) {
          mems.push(response.members[i].id)
        }
        for (let i = 0; i < response.leaders.length; i++) {
          leas.push(response.leaders[i].id)
        }
        this.members = mems
        this.leaders = leas
      })
    }
  }
}
</script>
