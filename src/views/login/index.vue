<template>
    <div class="container">
        <div class="drag">
            <el-form ref="form" :model="user">
                <el-form-item label="账号">
                    <el-input v-model="user.account"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="user.password"></el-input>
                </el-form-item>
                <el-form-item>
                <el-button type="primary" @click="onSubmit">立即登录</el-button>
                <el-button @click="onReset">清空</el-button>
            </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import userService from '../../apis/user'

    export default {

        data() {
            return {
                user: {
                    type: 0,
                    account: ''
                }
            }
        },
        methods: {

            onSubmit() {
                let that = this
                let val = this.user.account
                if (val.indexOf("@") > -1 && val.indexOf(".") > -1) {
                    this.user.email = val;
                } else if (val.length === 11) {
                    this.user.phone = val;
                } else {
                    this.user.username = val
                }
                if (this.user.account === null || this.user.account.length === 0) {
                    this.$notify({title: '错误', message: '请输入账户', type: 'error'})
                    return false
                 }
                if (this.user.password == null || this.user.password.length === 0) {
                    this.$notify({title: '错误', message: '请输入密码', type: 'error'})
                    return false
                }
                userService.login(this.user)
                    .then(res => {
                        if (res) {
                            that.$router.push('/')
                        }
                    })
            },

            onReset() {
                this.user = {}
            }

        }

    }
</script>

<style scoped>
.container {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    background: white url("../../../static/images/bg2.jpg") fixed no-repeat;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}

.drag{
    margin:100px auto;
    width:480px;
    height:320px;
    position: relative;
    padding: 20px;
    background: rgba(0,0,0,.5);
}

</style>