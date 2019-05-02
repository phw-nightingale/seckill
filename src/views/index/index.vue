<template>
    <div class="container">
        <el-row>
            <el-col :span="8" v-for="(p, index) in products" :key="index" :offset="index > 0 ? 2 : 0">
                <el-card :body-style="{ padding: '0px' }">
                    <img :src="p.image" class="image">
                    <div style="padding: 14px;">
                        <span>{{ p.name }}</span>&nbsp;&nbsp;&nbsp;<span style="font-size: 16px; color: orangered;">￥{{ p.price1 / 100 }}</span>
                        <div class="bottom clearfix">
                            <time class="time">{{ p.description }}</time>
                            <div>
                            <el-button @click="onAddCart(p.id)" type="primary" class="button">加入购物车</el-button>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <div class="bot-cont">
            <div class="cart">
                <h5>我的购物车</h5>
                <el-divider></el-divider>
                <div v-for="(item, index) in order.orderDetails" :key="index">
                    <span>品名:{{item.name}}, 数量:{{item.count}}, 小计:{{item.sum / 100}}元</span>
                    <el-divider></el-divider>
                </div>
                <el-button @click="onSubmit" type="primary">付款</el-button>
                <el-button @click="onClear" type="primary">清空购物车</el-button>
            </div>
            <div class="shell-cont">
                <el-form>
                    <el-form-item label="设置并发量">
                        <div style="margin-bottom: 20px; display: flex; justify-content: space-between;">
                            <el-input type="number" v-model="concurrent" style="width: 50%;"></el-input>
                            <el-button type="primary" @click="onTestClick">开始测试</el-button>
                        </div>
                        <span>服务器日志</span>
                        <el-input type="textarea"
                                  v-model="response"
                                  rows="20"

                                  v-loading="responseLoading"
                                  element-loading-text="拼命加载中"
                                  element-loading-spinner="el-icon-loading"
                                  element-loading-background="rgba(0, 0, 0, 0.8)"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%">
            <el-form ref="form" :model="order">
                <el-form-item label="手机号">
                    <el-input type="number" v-model="order.phone"></el-input>
                </el-form-item>
                <el-form-item label="收货地址">
                    <el-input type="text" v-model="order.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="onAddrSubmit">确 定</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>
    import seckillService from '../../apis/seckill'

    export default {
        data() {
            return {
                products: [
                    {
                        id: 1,
                        description: '直降700Xiaomi/小米游戏本 15.6英寸8代i7游戏1060笔记本6G独显学生吃鸡游戏笔记本电脑商务办公家用笔记本',
                        name: '小米笔记本',
                        image: 'https://img.alicdn.com/imgextra/i1/2616970884/O1CN01YFeCWF1IOuckhPDzS_!!2616970884.jpg_430x430q90.jpg',
                        price1: 500000
                    },
                    {
                        id: 2,
                        description: '【新品首发 6期免息】Asus/华硕飞行堡垒7代 R7 8G 512G 1050 15.6英寸窄边框游戏笔记本电脑吃鸡学生独显',
                        name: '华硕飞行堡垒',
                        image: 'https://img.alicdn.com/imgextra/i1/2616970884/O1CN01mZgmAs1IOudhbjXFW_!!2616970884.jpg_430x430q90.jpg',
                        price1: 450000
                    }
                ],
                order: {
                    status: 0,
                    address: '四川成都',
                    phone: '17776304754',
                    orderDetails: [

                    ]
                },
                dialogVisible: false,
                concurrent: 1,
                response: '',
                responseLoading: false
            }
        },

        methods: {
            onAddCart(pid) {
                let product = this.products.find(val => {
                    if (val.id === pid) {
                        return val
                    }
                })
                let orderDetail = this.order.orderDetails.find(val => {
                    if (val.productId === pid) {
                        return val
                    }
                })
                if (orderDetail) {
                    orderDetail.count++;
                    orderDetail.sum = orderDetail.sum + product.price1
                } else {
                     orderDetail = {
                         name: product.name,
                        productId: product.id,
                        count: 1,
                        sum: product.price1
                    }
                    this.order.orderDetails.push(orderDetail)
                }
            },

            onTestClick() {
                this.responseLoading = true
                seckillService.siegeTest(this.concurrent)
            },

            onSubmit() {
                this.dialogVisible = true
            },

            onClear() {
                this.order.orderDetails = []
            },

            onAddrSubmit() {

                seckillService.execSecKill(this.order)
                    .then(res => {
                        if (res) {
                            this.order.orderDetails = []
                            this.dialogVisible = false
                        }
                    })
            },

            //Websocket
            initWebSocket() {
                const url = 'ws://four-road-titans.xyz:8081/websocket/10';
                this.websock = new WebSocket(url)
                this.websock.onmessage = this.onWebSocketMessage;
                this.websock.onopen = this.onWebSocketOpen;
                this.websock.onclose = this.onWebSocketClose;
                this.websock.onerror = this.onWebSocketErr;
            },

            onWebSocketMessage(e) {
                console.log(e.data)
                this.response = e.data;
                this.responseLoading = false
            },

            onWebSocketOpen() {
                let user = JSON.parse(localStorage.getItem('user'))
                this.websock.send(user.username + '已上线!')
                console.log('websocket has been connected!')
            },

            onWebSocketClose(e) {
                console.log('websocket has been disconnected:', e)
            },

            onWebSocketErr() {
                this.initWebSocket();
            },

            webSocketSend(data) {
                this.websock.send(data)
            }

        },
        created() {
            this.initWebSocket();
        },
        destroyed() {
            this.onWebSocketClose();
        }
    }
</script>

<style scoped>
    .container {
        flex-direction: column;
    }
    .bot-cont {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: center;
        width: 100%;
    }
    .shell-cont {
        width: 600px;
    }
    .bot-cont > div {
        margin: 50px;
    }
    .cart {
        margin-top: 30px;
    }
    .time {
        font-size: 13px;
        line-height: 26px;
        color: #999;
        text-align: left;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {

    }

    .image {
        width: 100%;
        display: block;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

</style>