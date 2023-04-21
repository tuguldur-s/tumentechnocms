<template>
    <div class="scrollable">
        <div class="page-ecommerce-orders flex column" v-loading.fullscreen.lock="loading">
            <div class="page-header">
                <div class="flex justify-space-between">
                    <el-breadcrumb separator="/" class="mb-10">
                        <el-breadcrumb-item :to="{ path: '/ecommerce-dashboard' }"><i class="mdi mdi-home-outline"></i></el-breadcrumb-item>
                        <el-breadcrumb-item>Үнэлгээ</el-breadcrumb-item>
                    </el-breadcrumb>
                    
                </div>
            </div>
        </div>
        <div class="page-ecommerce-dashboard scrollable">
		    <div class="table-box card-base card-outline" :style="{'overflow': 'auto'}">
                <table class="styled striped hover" style="font-size: 16px;">
                    <thead>
                        <tr>
                            <th>ТАСАГ</th>
                            <th>ДУНДАЖ</th>
                            <th>ҮНЭЛСЭН</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in shops.list" :key="item.id" :style="{'cursor': 'pointer'}">
                            <td>
                                <div class="item-box item-customer">
                                    <h4 class="m-0 o-080">{{item.name}}</h4>
                                </div>
                            </td>
                            <td>
                                <div class="item-box item-customer">
                                    <!-- <h4 class="m-0 o-080">{{getShopReview(item.code)}}</h4> -->
                                    <!-- <el-progress type="dashboard" :percentage="getShopReview(item.code)" :stroke-width="1" :color="colors" :width="30"></el-progress> -->
                                    <strong style="color: #1989fa;">{{getShopReview(item.code)}}%</strong>
                                </div>
                            </td>
                            <td>
                                <div class="item-box item-customer">
                                    <!-- <h4 class="m-0 o-080">{{getShopReview2(item.code)}}</h4> -->
                                    <div v-if="getShopReview2(item.code).length > 0">
                                        <el-progress  v-for="(i, index) in getShopReview2(item.code)" :stroke-width="4" class="ml-5" :key="index" :percentage="i" :color="colors" :width="30"></el-progress>
                                    </div>
                                    <div v-else> ҮНЭЛЭЭГҮЙ </div>
                                </div>
                            </td>
                            <td>
                                <div class="item-box item-customer">
                                    <!-- <el-button @click="getCurrentShop(item)" icon="el-icon-setting" size="small" circle></el-button> -->
                                    <el-dropdown trigger="click">
                                        <span class="el-dropdown-link">
                                            <i class="el-icon-s-tools"></i>
                                        </span>
                                        <el-dropdown-menu slot="dropdown">
                                            <!-- <el-dropdown-item icon="el-icon-info" @click.native="getCurrentShop(item)"> Тохиргоо</el-dropdown-item> -->
                                            <el-dropdown-item icon="el-icon-star-off" @click.native="setReview(item)"> Үнэлгээ</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="page-ecommerce-dashboard scrollable mt-20">
		    <div class="table-box card-base card-outline" :style="{'overflow': 'auto'}">
                <table class="styled striped hover" style="font-size: 16px;">
                    <thead>
                        <tr>
                            <th>АЖИЛТАН</th>
                            <th>ДУНДАЖ</th>
                            <th>ҮНЭЛГЭЭ</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in buildUsers()" :key="index" :style="{'cursor': 'pointer'}">
                            <td>
                                <div class="item-box item-customer">
                                    <h4 class="m-0 o-080">{{item.name}}</h4>
                                </div>
                            </td>
                            <td>
                                <div class="item-box item-customer">
                                    <!-- <el-progress type="dashboard" :stroke-width="1" :percentage="item.avg" :color="colors" :width="30"></el-progress> -->
                                    <strong style="color: #1989fa;">{{item.avg}}%</strong>
                                </div>
                            </td>
                            <td>
                                <div class="item-box item-customer">
                                    <el-tooltip class="item" effect="dark" content="Тасаг" placement="top">
                                        <el-progress :stroke-width="4" :percentage="item.shop" :color="colors" :width="30"></el-progress>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="Ажилтан" placement="top">
                                        <el-progress :stroke-width="4" :percentage="item.rate" :color="colors" :width="30"></el-progress>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="Борлуулалт" placement="top">
                                        <el-progress :stroke-width="4" :percentage="item.sale" :color="colors" :width="30"></el-progress>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="Хоцролт" placement="top">
                                        <el-progress :stroke-width="4" :percentage="item.lost" :color="colors" :width="30"></el-progress>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="Санал гомдол" placement="top">
                                        <el-progress :stroke-width="4" :percentage="item.feedback" :color="colors" :width="30"></el-progress>
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="Тасаг орхилт" placement="top">
                                        <el-progress :stroke-width="4" :percentage="item.response" :color="colors" :width="30"></el-progress>
                                    </el-tooltip>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <el-dialog title="Засварлах" :visible.sync="modals.editItem" width="30%">
            <el-row :gutter="10">
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-time-select style="width: 100%"
                        placeholder="Эхлэх цаг"
                        v-model="shops.selected.start"
                        :picker-options="{
                        start: '00:00',
                        step: '00:05',
                        end: '23:59'
                        }">
                    </el-time-select>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-time-select style="width: 100%"
                        placeholder="Эхлэх цаг"
                        v-model="shops.selected.end"
                        :picker-options="{
                        start: '00:00',
                        step: '00:05',
                        end: '23:59'
                        }">
                    </el-time-select>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mt-10">
                    <el-input placeholder="Өдрийн ээлж" v-model="shops.selected.second_part" clearable></el-input>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mt-10">
                    <el-time-select style="width: 100%"
                        placeholder="Амралтын өдрийн ажлын цаг"
                        v-model="shops.selected.weekend"
                        :picker-options="{
                        start: '00:00',
                        step: '00:05',
                        end: '23:59'
                        }">
                    </el-time-select>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mt-10">
                    <el-select v-model="shops.selected.rest" placeholder="Амралтын өдөр" style="width: 100%">
                        <el-option
                        v-for="(item, index) in days"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mt-10">
                    <el-input placeholder="Өдрийн орлого" v-model="shops.selected.sale_plan_day" clearable></el-input>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mt-10">
                    <el-input placeholder="Өдрийн орлого" v-model="shops.selected.sale_plan" clearable></el-input>
                </el-col>
            </el-row>
			<span slot="footer" class="dialog-footer">
				<el-button @click="modals.editItem = false">Болих</el-button>
				<el-button type="primary" @click="saveShop">Хадгалах</el-button>
			</span>
		</el-dialog>

        <el-dialog :title="review.title" :visible.sync="review.modal" width="90%">
            <el-row :gutter="10">
                <el-select v-model="selectedEmp.id" filterable placeholder="Ажилтнаа сонгоно уу" class="mb-20" style="width: 100%;" @change="changeEmployee">
                    <el-option
                        v-for="(item, index) in lose"
                        :key="index"
                        :label="item.name"
                        :value="item.user_id">
                    </el-option>
                </el-select>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <div>
                        <span><b>Өдөр тутмын үйл ажиллагаа</b></span>
                        <div style="width: 100%; height: 1px; background: #e3e3e3; margin-top: 10px; margin-bottom: 10px;"></div>
                    </div>
                </el-col>
                <el-row>
                    <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7" class="mt-5">
                        <span class="cut-text">1. Борлуулалт</span>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="padding-left: 15%;" class="mt-5"></el-col>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11" class="mt-5">
                        <el-rate v-model="selectedEmp.sale" disabled></el-rate>
                    </el-col>

                    <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7" class="mt-5">
                        <span class="cut-text">2. Хоцролт</span>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="padding-left: 15%;" class="mt-5"></el-col>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11" class="mt-5">
                        <el-rate v-model="selectedEmp.lose" disabled></el-rate>
                    </el-col>
                </el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <div align="right">
                        <div style="width: 100%; height: 1px; background: #e3e3e3; margin-top: 10px; margin-bottom: 10px;"></div>
                        <span><b>{{totalDynamicCalc}}%</b></span>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <div>
                        <span><b>Ажилтанд тавигдах стандарт</b></span>
                        <!-- <el-divider></el-divider> -->
                        <div style="width: 100%; height: 1px; background: #e3e3e3; margin-top: 10px; margin-bottom: 10px;"></div>
                    </div>
                </el-col>
                <el-row>
                    <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7" class="mt-5">
                        <span class="cut-text">1. Хувцаслалт</span>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="padding-left: 15%;" class="mt-5">
                        <!-- <el-checkbox v-model="checkBox.une"></el-checkbox> -->
                        <div class="check-box">
                            <input id="huwts" v-model="checkBox.huwts" type="checkbox" @change="employeeChecked('huwts')">
                            <span class="check"></span>
                            <label for="huwts"><b>-</b></label>
                        </div>
                    </el-col>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11" class="mt-5">
                        <el-rate v-model="review.employee.huwts" :colors="colorRate" @change="rateChanged('huwts')"></el-rate>
                    </el-col>

                    <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7" class="mt-5">
                        <span class="cut-text">2. Харьцаа</span>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="padding-left: 15%;" class="mt-5">
                        <!-- <el-checkbox v-model="checkBox.une"></el-checkbox> -->
                        <div class="check-box">
                            <input id="haritsaa" v-model="checkBox.haritsaa" type="checkbox" @change="employeeChecked('haritsaa')">
                            <span class="check"></span>
                            <label for="haritsaa"><b>-</b></label>
                        </div>
                    </el-col>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11" class="mt-5">
                        <el-rate v-model="review.employee.haritsaa" :colors="colorRate" @change="rateChanged('haritsaa')"></el-rate>
                    </el-col>

                    <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7" class="mt-5">
                        <span class="cut-text">3. Програм ашиглалт</span>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="padding-left: 15%;" class="mt-5">
                        <!-- <el-checkbox v-model="checkBox.une"></el-checkbox> -->
                        <div class="check-box">
                            <input id="program" v-model="checkBox.program" type="checkbox" @change="employeeChecked('program')">
                            <span class="check"></span>
                            <label for="program"><b>-</b></label>
                        </div>
                    </el-col>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11" class="mt-5">
                        <el-rate v-model="review.employee.program" :colors="colorRate" @change="rateChanged('program')"></el-rate>
                    </el-col>

                    <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7" class="mt-5">
                        <span class="cut-text">4. Цэвэрлэгээ</span>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="padding-left: 15%;" class="mt-5">
                        <!-- <el-checkbox v-model="checkBox.une"></el-checkbox> -->
                        <div class="check-box">
                            <input id="tsewerlegee" v-model="checkBox.tsewerlegee" type="checkbox" @change="employeeChecked('tsewerlegee')">
                            <span class="check"></span>
                            <label for="tsewerlegee"><b>-</b></label>
                        </div>
                    </el-col>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11" class="mt-5">
                        <el-rate v-model="review.employee.tsewerlegee" :colors="colorRate" @change="rateChanged('tsewerlegee')"></el-rate>
                    </el-col>

                    <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7" class="mt-5">
                        <span class="cut-text">5. Барааны мэдлэг</span>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="padding-left: 15%;" class="mt-5">
                        <!-- <el-checkbox v-model="checkBox.une"></el-checkbox> -->
                        <div class="check-box">
                            <input id="baraanii_medleg" v-model="checkBox.baraanii_medleg" type="checkbox" @change="employeeChecked('baraanii_medleg')">
                            <span class="check"></span>
                            <label for="baraanii_medleg"><b>-</b></label>
                        </div>
                    </el-col>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11" class="mt-5">
                        <el-rate v-model="review.employee.baraanii_medleg" :colors="colorRate" @change="rateChanged('baraanii_medleg')"></el-rate>
                    </el-col>

                    <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7" class="mt-5">
                        <span class="cut-text">6. Буцаалт</span>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="padding-left: 15%;" class="mt-5">
                        <!-- <el-checkbox v-model="checkBox.une"></el-checkbox> -->
                        <div class="check-box">
                            <input id="butsaalt" v-model="checkBox.butsaalt" type="checkbox" @change="employeeChecked('butsaalt')">
                            <span class="check"></span>
                            <label for="butsaalt"><b>-</b></label>
                        </div>
                    </el-col>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11" class="mt-5">
                        <el-rate v-model="review.employee.butsaalt" :colors="colorRate" @change="rateChanged('butsaalt')"></el-rate>
                    </el-col>
                </el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <div align="right">
                        <div style="width: 100%; height: 1px; background: #e3e3e3; margin-top: 10px; margin-bottom: 10px;"></div>
                        <span><b>{{totalEmployee}}%</b></span>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <div>
                        <span><b>Дэлгүүрийн стандарт</b></span>
                        <!-- <el-divider></el-divider> -->
                        <div style="width: 100%; height: 1px; background: #e3e3e3; margin-top: 10px; margin-bottom: 10px;"></div>
                    </div>
                </el-col>
                <el-row>
                    <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
                        <span class="cut-text">1. Үнэ тавилт</span>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="padding-left: 15%;">
                        <!-- <el-checkbox v-model="checkBox.une"></el-checkbox> -->
                        <div class="check-box">
                            <input id="une" v-model="checkBox.une" type="checkbox" @change="shopChecked('une')">
                            <span class="check"></span>
                            <label for="une"><b>-</b></label>
                        </div>
                    </el-col>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
                        <el-rate v-model="review.shop.une" :colors="colorRate" @change="rateChanged('une')"></el-rate>
                    </el-col>

                    <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7" class="mt-5">
                        <span class="cut-text">2. Өрөлт</span>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="padding-left: 15%;" class="mt-5">
                        <!-- <el-checkbox v-model="checkBox.une"></el-checkbox> -->
                        <div class="check-box">
                            <input id="orolt" v-model="checkBox.orolt" type="checkbox" @change="shopChecked('orolt')">
                            <span class="check"></span>
                            <label for="orolt"><b>-</b></label>
                        </div>
                    </el-col>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11" class="mt-5">
                        <el-rate v-model="review.shop.orolt" :colors="colorRate" @change="rateChanged('orolt')"></el-rate>
                    </el-col>

                    <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7" class="mt-5">
                        <span class="cut-text">3. Дэлгүүрийн БББ</span>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="padding-left: 15%;" class="mt-5">
                        <!-- <el-checkbox v-model="checkBox.une"></el-checkbox> -->
                        <div class="check-box">
                            <input id="technical" v-model="checkBox.technical" type="checkbox" @change="shopChecked('technical')">
                            <span class="check"></span>
                            <label for="technical"><b>-</b></label>
                        </div>
                    </el-col>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11" class="mt-5">
                        <el-rate v-model="review.shop.technical" :colors="colorRate" @change="rateChanged('technical')"></el-rate>
                    </el-col>

                    <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7" class="mt-5">
                        <span class="cut-text">4. Татан авалт</span>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="padding-left: 15%;" class="mt-5">
                        <!-- <el-checkbox v-model="checkBox.une"></el-checkbox> -->
                        <div class="check-box">
                            <input id="tatan_avalt" v-model="checkBox.tatan_avalt" type="checkbox" @change="shopChecked('tatan_avalt')">
                            <span class="check"></span>
                            <label for="tatan_avalt"><b>-</b></label>
                        </div>
                    </el-col>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11" class="mt-5">
                        <el-rate v-model="review.shop.tatan_avalt" :colors="colorRate" @change="rateChanged('tatan_avalt')"></el-rate>
                    </el-col>

                    <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7" class="mt-5">
                        <span class="cut-text">5. Баримт цэгцлэлт</span>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="padding-left: 15%;" class="mt-5">
                        <!-- <el-checkbox v-model="checkBox.une"></el-checkbox> -->
                        <div class="check-box">
                            <input id="barimt" v-model="checkBox.barimt" type="checkbox" @change="shopChecked('barimt')">
                            <span class="check"></span>
                            <label for="barimt"><b>-</b></label>
                        </div>
                    </el-col>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11" class="mt-5">
                        <el-rate v-model="review.shop.barimt" :colors="colorRate" @change="rateChanged('barimt')"></el-rate>
                    </el-col>

                    <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7" class="mt-5">
                        <span class="cut-text">6. Барааны үзэмж</span>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="padding-left: 15%;" class="mt-5">
                        <!-- <el-checkbox v-model="checkBox.une"></el-checkbox> -->
                        <div class="check-box">
                            <input id="uzemj" v-model="checkBox.uzemj" type="checkbox" @change="shopChecked('uzemj')">
                            <span class="check"></span>
                            <label for="uzemj"><b>-</b></label>
                        </div>
                    </el-col>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11" class="mt-5">
                        <el-rate v-model="review.shop.uzemj" :colors="colorRate" @change="rateChanged('uzemj')"></el-rate>
                    </el-col>
                </el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <div align="right">
                        <div style="width: 100%; height: 1px; background: #e3e3e3; margin-top: 10px; margin-bottom: 10px;"></div>
                        <span><b>{{totalShop}}%</b></span>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <div>
                        <span><b>Санал гомдол</b></span>
                        <!-- <el-divider></el-divider> -->
                        <div style="width: 100%; height: 1px; background: #e3e3e3; margin-top: 10px; margin-bottom: 10px;"></div>
                    </div>
                </el-col>
                <el-row>
                    <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7" class="mt-5">
                        <span class="cut-text">1. Тасаг орхилт</span>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="padding-left: 15%;" class="mt-5">
                        <!-- <el-checkbox v-model="checkBox.une"></el-checkbox> -->
                        <div class="check-box">
                            <input id="tasag_orhih" v-model="checkBox.tasag_orhih" type="checkbox" @change="checkChanged('tasag_orhih')">
                            <span class="check"></span>
                            <label for="tasag_orhih"><b>-</b></label>
                        </div>
                    </el-col>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11" class="mt-5">
                        <el-rate v-model="review.feedback.tasag_orhih" :colors="colorRate" :max="limitResponse" @change="rateChanged('tasag_orhih')"></el-rate>
                    </el-col>

                    <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7" class="mt-5">
                        <span class="cut-text">2. Санал гомдол</span>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="padding-left: 15%;" class="mt-5">
                        <!-- <el-checkbox v-model="checkBox.une"></el-checkbox> -->
                        <div class="check-box">
                            <input id="feedback" v-model="checkBox.feedback" type="checkbox" @change="checkChanged('feedback')">
                            <span class="check"></span>
                            <label for="feedback"><b>-</b></label>
                        </div>
                    </el-col>
                    <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11" class="mt-5">
                        <el-rate v-model="review.feedback.feedback" :colors="colorRate" :max="limitFeedback" @change="rateChanged('feedback')"></el-rate>
                        <!-- <el-rate v-model="review.feedback.feedback" :icon-classes="iconClasses" void-icon-class="icon-rate-face-off" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate> -->
                    </el-col>
                </el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <div align="right">
                        <div style="width: 100%; height: 1px; background: #e3e3e3; margin-top: 10px; margin-bottom: 10px;"></div>
                        <span><b>{{feedbackCalculate}}%</b></span>
                    </div>
                </el-col>
            </el-row>
			<span slot="footer" class="dialog-footer">
				<el-button @click="review.modal = false">Болих</el-button>
				<el-button type="primary" @click="saveShopReview">Хадгалах</el-button>
			</span>
		</el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            iconClasses: ['icon-rate-face-1', 'icon-rate-face-2', 'icon-rate-face-3'], // same as { 2: 'icon-rate-face-1', 4: { value: 'icon-rate-face-2', excluded: true }, 5: 'icon-rate-face-3' }
            limitFeedback: 5,
            limitResponse: 5,
            checkBox: {
                checked: [],
                une: false,
                orolt: false,
                technical: false,
                tatan_avalt: false,
                barimt: false,
                uzemj: false,
                tasag_orhih: false,
                feedback: false,
                huwts: false,
                haritsaa: false,
                program: false,
                tsewerlegee: false,
                baraanii_medleg: false,
                butsaalt: false
            },
            review: {
                modal: false,
                title: '',
                shop: {
                    une: 0,
                    orolt:0,
                    technical: 0,
                    tatan_avalt: 0,
                    barimt: 0,
                    uzemj: 0
                },
                employee : {
                    huwts: 0,
                    haritsaa: 0,
                    program: 0,
                    tsewerlegee: 0,
                    baraanii_medleg: 0,
                    butsaalt: 0
                },
                feedback: {
                    feedback: 0,
                    tasag_orhih: 0
                }
            },
            shops: {
                selected: [],
                list: []
            },
            loading: false,
            sale: [],
            lose: [],
            shopReviews: [],
            userReviews: [],
            modals: {
                editItem: false
            },
            days: [{
                label: 'None',
                value: 'none'
            },{
                label: 'Monday',
                value: 'Mon'
            },{
                label: 'Tuesday',
                value: 'Thu'
            },{
                label: 'Wednesday',
                value: 'Wed'
            },{
                label: 'Thursday',
                value: 'Thu'
            },{
                label: 'Friday',
                value: 'Fri'
            },{
                label: 'Saturday',
                value: 'Sat'
            },{
                label: 'Sunday',
                value: 'Sun'
            }],
            colors: [
                {color: '#f56c6c', percentage: 20},
                {color: '#e6a23c', percentage: 40},
                {color: '#5cb87a', percentage: 60},
                {color: '#1989fa', percentage: 80},
                {color: '#6f7ad3', percentage: 100}
            ], 
            colorRate: ['#99A9BF', '#F7BA2A', '#FF9900'],
            selectedEmp: {
                id: '',
                sale: 0,
                lose: 0,
                losePercent: 0,
                salePercent: 0
            }
        }
    },
    mounted() {
        // var d = new Date();
        // var date = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        // console.log(date.getDate(), d.getDate());
        this.getShops();
    },
    computed: {
        totalShop() {
            var a = this.review.shop;
            return parseInt((a.une + a.orolt + a.technical + a.tatan_avalt + a.barimt + a.uzemj) / 6 * 20);
        },
        totalEmployee() {
            var a = this.review.employee;
            return parseInt((a.huwts + a.haritsaa + a.program + a.tsewerlegee + a.baraanii_medleg + a.butsaalt) / 6 * 20);
        },
        feedbackCalculate() {
            var tasag = 10 / 5;
            var sanal = 6 / 5;
            tasag = this.review.feedback.tasag_orhih * tasag;
            sanal = this.review.feedback.feedback * sanal;
            var total = tasag + sanal;
            return parseInt(total / 16 * 100);
        },
        totalDynamicCalc() {
            var s = this.selectedEmp.salePercent * 40 / 100;
            var l = this.selectedEmp.losePercent * 5 / 100;
            var t = ( l + s ) * 100 / 45;
            return parseInt(t);
        }
    },
    methods: {
        buildUsers() {
            var users = [];
            this.lose.forEach(el => {
                
                var lost = 0, rate = 0, sale = 0;
                if(el.losttime == 0) {
                    lost = 100;
                } else if(el.losttime >= 60) {
                    lost = 0;
                } else {
                    var e = el.losttime * 100 / 60;
                    lost = parseInt(100 - e);
                }
                this.userReviews.forEach(u => {
                    if(u.userId == el.user_id) {
                        rate = u.percent;
                    }
                });

                this.sale.forEach(s => {
                    if(s.user_id == el.user_id) {
                        if(s.percent > 100) {
                            sale = 100;
                        } else {
                            sale = s.percent;
                        }
                    }
                });
                var calcSale = sale * 40 / 100;
				var calcLost = lost * 5 / 100;
				var calcRate = rate * 18 / 100;
				var calcFeed = el.feedback * 6 / 100;
				var calcRes = el.response * 10 / 100;
				var calcShop = this.getShopReview(el.call_store) * 15 / 100;
                
				
                users.push({name: el.name, image: el.img, userId: el.user_id, avg: (calcSale + calcLost + calcRate + calcFeed + calcRes + calcShop + 6).toFixed(1), lost, rate, sale, feedback: el.feedback, response: el.response, shop: this.getShopReview(el.call_store)});
            });
            function compare(a, b) {
				if (a.avg > b.avg)
					return -1;
				if (a.avg < b.avg)
					return 1;
				return 0;
			}
			users =  users.sort(compare);
            return users;
        },
        changeEmployee(value) {
            var lose = 0;
            this.lose.forEach(el => {
                if(el.user_id == value) {
                    lose = el.losttime;
                    this.limitFeedback = parseInt(el.feedback / 20);
                    this.review.feedback.feedback = parseInt(el.feedback / 20);
                    this.limitResponse = parseInt(el.response / 20);
                    this.review.feedback.tasag_orhih = parseInt(el.response / 20);
                }
            });
            if(lose == 0) {
                this.selectedEmp.lose = 5;
            } else if(lose >= 60) {
                this.selectedEmp.lose = 0;
            } else {
                var e = lose * 100 / 60;
                e = 100 - e;
                this.selectedEmp.losePercent = e;
                e = e * 5 / 100;
                this.selectedEmp.lose = e;
            }
            lose = 0;
            this.sale.forEach(el => {
                if(el.user_id == value) {
                    lose = el.percent;
                }
            });
            if(lose > 100) {
                lose = 100;
            } 
            this.selectedEmp.salePercent = lose;
            this.selectedEmp.sale = lose * 5 / 100;
        },
        getShopReview(item) {
            var rate = 0, index = 0;
            this.shopReviews.forEach(el => {
                if(el.storeId == item) {
                    rate += el.total_shop;
                    index++;
                }
            });
            if(index > 0) {
                return parseInt(rate / index);
            }
            return 0;
        },
        getShopReview2(item) {
            var rates = [];
            this.shopReviews.forEach(el => {
                if(el.storeId == item) {
                    rates.push(el.total_shop);
                }
            });
            return rates;
        },
        rateChanged(item) {
            this.checkBox.checked.forEach((el, index) => {
                if(el == item) {
                    this.checkBox.checked.splice(index, 1)
                }
            });
            this.checkBox[item] = false;
        },
        employeeChecked(item) {
            if(this.checkBox[item]) {
                var b = false;
                this.checkBox.checked.forEach(el => {
                    if(el == item) {
                        b = true;
                    }
                });
                if(!b) {
                    this.checkBox.checked.push(item);
                }
                this.review.employee[item] = 0;
            } else {
                this.checkBox.checked.forEach((el, index) => {
                    if(el == item) {
                        this.checkBox.checked.splice(index, 1)
                    }
                });
            }
        },
        shopChecked(item) {
            if(this.checkBox[item]) {
                var b = false;
                this.checkBox.checked.forEach(el => {
                    if(el == item) {
                        b = true;
                    }
                });
                if(!b) {
                    this.checkBox.checked.push(item);
                }
                this.review.shop[item] = 0;
            } else {
                this.checkBox.checked.forEach((el, index) => {
                    if(el == item) {
                        this.checkBox.checked.splice(index, 1)
                    }
                });
            }
        },
        checkChanged(item) {
            if(this.checkBox[item]) {
                var b = false;
                this.checkBox.checked.forEach(el => {
                    if(el == item) {
                        b = true;
                    }
                });
                if(!b) {
                    this.checkBox.checked.push(item);
                }
                this.review.feedback[item] = 0;
            } else {
                this.checkBox.checked.forEach((el, index) => {
                    if(el == item) {
                        this.checkBox.checked.splice(index, 1)
                    }
                });
            }
        },
        saveShopReview() {
            if(this.selectedEmp.id == '') {
                this.$notify({
                    title: 'Амжилтгүй',
                    dangerouslyUseHTMLString: true,
                    message: `Ажилтнаа сонгоно уу`,
                    type: 'error'
                });
            } else {
                var totalEmp = this.totalEmployee;
                var totalShop = this.totalShop;
                this.loading = true;
                var rts = this;
                const token = localStorage.getItem('token');
                if(token) {
                    this.$axios({
                        method: 'post',
                        url: rts.$appUrl +`/api/usefull/set-review-shop`,
                        headers: {
                            "Authorization": `Bearer ${token}`
                        },
                        data: {
                            store: this.shops.selected,
                            userId: this.selectedEmp.id,
                            emp: this.review.employee,
                            shop: this.review.shop,
                            totalEmp,
                            totalShop,
                            feedback: this.review.feedback
                        }
                    })
                    .then(function(data){
                        rts.loading = false;
                        if(data.data.result == 'success') {
                            rts.review.modal = false;
                            rts.$notify({
                                title: 'Амжилттай',
                                dangerouslyUseHTMLString: true,
                                message: `Үнэлгээ хадгалагдлаа`,
                                type: 'success'
                            });
                            rts.getShops();
                        }
                        
                    }).catch(error => {
                        console.log(error);
                        rts.loading = false;
                    });
                }
            }
        },
        setReview(item) {
            this.shops.selected = item;
            this.review.title = item.name;
            this.review.modal = true;
        },
        saveShop() {
            if(this.shops.selected.start == null || this.shops.selected.end == null || this.shops.selected.second_part == '' || this.shops.selected.weekend == null || this.shops.selected.sale_plan == '' || this.shops.selected.sale_plan_day == '') {
                this.$notify({
                    title: 'Амжилтгүй',
                    dangerouslyUseHTMLString: true,
                    message: `Талбараа бүрэн бөглөнө үү`,
                    type: 'error'
                });
            } else {
                this.loading = true;
                var rts = this;
                const token = localStorage.getItem('token');
                if(token) {
                    this.$axios({
                        method: 'post',
                        url: rts.$appUrl +`/api/usefull/edit-shop`,
                        headers: {
                            "Authorization": `Bearer ${token}`
                        },
                        data: {
                            shop: this.shops.selected
                        }
                    })
                    .then(function(data){
                        rts.loading = false;
                        if(data.data.result == 'success') {
                            rts.modals.editItem = false;
                            rts.$notify({
                                title: 'Амжилттай',
                                dangerouslyUseHTMLString: true,
                                message: `Мэдээлэл шинэчлэгдлээ`,
                                type: 'success'
                            });
                        }
                        
                    }).catch(error => {
                        console.log(error);
                        rts.loading = false;
                    });
                }
            }
        },
        getCurrentShop(s) {
            this.shops.selected = s;
            this.modals.editItem = true;
        },
        getShops() {
            this.loading = true;
            var rts = this;
			const token = localStorage.getItem('token');
			if(token) {
				this.$axios({
					method: 'post',
					url: rts.$appUrl +`/api/usefull/shops`,
					headers: {
						"Authorization": `Bearer ${token}`
					}
				})
				.then(function(data){
                    rts.loading = false;
					if(data.data.result == 'success') {
						rts.shops.list = data.data.shops;
                        rts.lose = data.data.lose;
                        rts.sale = data.data.EmpSale;
                        rts.shopReviews = data.data.shopReview;
                        rts.userReviews = data.data.reviewUsers;
                        // rts.buildUsers();
                        
					}
					
				}).catch(error => {
					console.log(error);
                    rts.loading = false;
				});
			}
        }
    }
}
</script>
<style lang="scss" scoped>
.cut-text { 
  text-overflow: ellipsis;
  overflow: hidden; 
  width: 100%; 
  height: 1.2em; 
  white-space: nowrap;
}

.check-box {
    width: 100px;
    margin-top: 0px;
    display: flex;
    align-items: center;
    user-select: none;

    label {
        font-size: 15px;
        color: #f53520;
        position: absolute;
        z-index: 10;
        padding-left: 6px;
        cursor: pointer;
        margin-top: -4px;
    }

    input {
        opacity: 0;
        visibility: hidden;
        position: absolute;

        &:checked {

            ~ .check {
                border-color: #f53520;
                box-shadow: 0px 0px 0px 15px #f53520 inset;

                &::after {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        }
    }

    .check {
        width: 15px;
        height: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        border-radius: 100px;
        background-color: #FFF;
        border: 2px solid #f53520;
        box-shadow: 0px 0px 0px 0px #f53520 inset;
        transition: all 0.15s cubic-bezier(0, 1.05, 0.72, 1.07);

        &::after {
            content: '';
            width: 100%;
            height: 100%;
            opacity: 0;
            z-index: 4;
            position: absolute;
            transform: scale(0);
            background-size: 50%;
            background-image: url('http://s6.picofile.com/d/8392306668/c38c12a0-6db3-47d4-a80c-7dad8fab5186/checkmark.svg');
            background-repeat: no-repeat;
            background-position: center;
            transition-delay: 0.2s !important;
            transition: all 0.25s cubic-bezier(0, 1.05, 0.72, 1.07);
        }
    }
}
</style>