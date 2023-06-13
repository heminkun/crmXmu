<template>
  <div class="flex" style="width: 95%;height: 90%;">
    <div class="flex column" style="width: 100%;">
      <div  style="background-color: white" class="no-hover-highlight">

        <el-descriptions
            :column="3"
            border
            title="客户信息管理"
        >
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon>
                    <user />
                  </el-icon>
                  客户名称
                </div>
              </template>
              <el-input style="width: 300px;" type="text" size="small" v-model="state.select.custName">
                <template #suffix>
                  <el-icon @click="selectByCustName"><Search /></el-icon>
                </template>
              </el-input>
            </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                客户编号
              </div>
            </template>
            <el-input v-model="state.select.custNo" style="width: 300px;" type="text" size="small">
              <template #suffix>
                <el-icon @click="getData"><Search/></el-icon>
              </template>
            </el-input>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                客户等级
              </div>
            </template>
            <el-select @change="getData" size="small" v-model="state.selectValue">
              <el-option
              v-for="item in state.optionItems"
              :label="item.lable"
              :value="item.value"
              >
              </el-option>
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                客户经理
              </div>
            </template>
            <el-input v-model="state.select.custManagerName" style="width: 300px;" type="text" size="small">
              <template #suffix>
                <el-icon @click="getData"><Search/></el-icon>
              </template>
            </el-input>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                地区
              </div>
            </template>
            <el-select @change="getData" size="small" v-model="state.select.custAddrFuzzy">
              <el-option
                  v-for="item in state.optionItemsAddr"
                  :label="item.lable"
                  :value="item.value"
              >
              </el-option>
            </el-select>
          </el-descriptions-item>
        </el-descriptions>
        <el-table v-loading="state.tableLoading"  size="large" :highlight-current-row="false" :data="state.data"  style="width: 100%;height:287px">
          <!--    <el-table-column v-if="false" prop="chcId" label="编号" width="180" />-->
          <el-table-column prop="custNo" label="客户编号" width="300" />
          <el-table-column prop="custName" label="客户名称" width="180"  />
          <el-table-column prop="custRegion" label="地区" />
          <el-table-column prop="custManagerName" label="客户经理" />
          <el-table-column prop="custLevel" label="客户等级" >
            <template #default="{row}">
              <span v-if="row.custLevel==1">
                普通客户
              </span>
              <span v-if="row.custLevel==2">
                银牌客户
              </span>
              <span v-if="row.custLevel==3">
                金牌客户
              </span>
              <span v-if="row.custLevel==4">
                钻石客户
              </span>
              <span v-if="row.custLevel==5">
                超级客户
              </span>
            </template>
          </el-table-column>
          <el-table-column   width="200" label="操作">
            <template #default="{row}">
              <el-tooltip
                  effect="light "
                  content="编辑"
                  placement="top-start"
              ><el-icon @click="edit(row)"><EditPen /></el-icon>
              </el-tooltip>
              <el-tooltip
                  effect="light "
                  content="联系人"
                  placement="top-start"
              ><el-icon @click="view(row)"><User /></el-icon></el-tooltip>
              <el-tooltip
                  effect="light "
                  content="交往记录"
                  placement="top-start"
              ><el-icon @click="Social(row)"><Switch /></el-icon></el-tooltip>
              <el-tooltip
                  effect="light "
                  content="历史记录"
                  placement="top-start"
              > <el-icon @click="history(row)"><Operation /></el-icon></el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            background
            :page-size="state.paging.pageSize"
            :total="state.paging.total"
            @current-change="handleCurrentChange"
            v-model="state.paging.currentPage"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
        class="flex"
        v-model="state.dialogOn.on_off"
        style="justify-content: center"
        width="1200"
        @close="clean"
    >
      <el-descriptions
          style="width: 900px"
          :column="2"
          border
          title="客户基本信息">
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              用户编号
            </div>
          </template>
          {{state.editData.custNo}}
        </el-descriptions-item>
        <el-descriptions-item  v-if="state.dialogOn.dialogState==1">
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
             客户经理
            </div>
          </template>
          {{state.editData.custManagerName}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              客户名称
            </div>
          </template>
          {{state.editData.custName}}
        </el-descriptions-item>
        <el-descriptions-item  v-if="state.dialogOn.dialogState==1">
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              地区
            </div>
          </template>
          <el-select v-model="state.editData.custRegion" size="small">
            <el-option
                v-for="item in state.optionItemsAddr2"
                :label="item.lable"
                :value="item.value">
            </el-option>
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item  v-if="state.dialogOn.dialogState==1">
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              客户等级
            </div>
          </template>
          <el-select v-model="state.editData.custLevel" size="small">
            <el-option
                v-for="item in state.optionItems2"
                :label="item.lable"
                :value="item.value">
            </el-option>
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item  v-if="state.dialogOn.dialogState==1">
        </el-descriptions-item>
        <el-descriptions-item  v-if="state.dialogOn.dialogState==1">
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              客户满意度
            </div>
          </template>
          <el-select v-model="state.editData.custSatisfy" size="small">
            <el-option
                v-for="item in state.spot"
                :label="item.lable"
                :value="item.value">
            </el-option>
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item  v-if="state.dialogOn.dialogState==1">
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              客户信用度
            </div>
          </template>
          <el-select v-model="state.editData.custCredit" size="small">
            <el-option
                v-for="item in state.spot2"
                :label="item.lable"
                :value="item.value">
            </el-option>
          </el-select>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions
          :column="2"
          border
          title="客户联系信息"
          v-if="state.dialogOn.dialogState==1"
      >
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              地址
            </div>
          </template>
          <el-input size="small" v-model="state.editData.custAddr"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              邮编
            </div>
          </template>
          <el-input size="small" v-model="state.editData.custZip"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              电话
            </div>
          </template>
          <el-input size="small" v-model="state.editData.custTel"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              传真
            </div>
          </template>
          <el-input size="small" v-model="state.editData.custFax"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              网咨
            </div>
          </template>
          <el-input size="small" v-model="state.editData.custWebsite"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions
          :column="2"
          border
          title="公司信息"
          v-if="state.dialogOn.dialogState==1"
      >
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              营业执照号
            </div>
          </template>
          <el-input size="small" v-model="state.editData.custLicenceNo"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              法人
            </div>
          </template>
          <el-input size="small" v-model="state.editData.custChieftain"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              注册资金(万元)
            </div>
          </template>
          <el-input size="small" v-model="state.editData.custBankroll"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              年营业额
            </div>
          </template>
          <el-input size="small" v-model="state.editData.custTurnover"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              开户银行
            </div>
          </template>
          <el-input size="small" v-model="state.editData.custBank"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              银行账号
            </div>
          </template>
          <el-input size="small" v-model="state.editData.custBankAccount"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              地税登记号
            </div>
          </template>
          <el-input size="small" v-model="state.editData.custLocalTaxNo"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              国税登记号
            </div>
          </template>
          <el-input size="small" v-model="state.editData.custNationalTaxNo"></el-input>
        </el-descriptions-item>
      </el-descriptions>
      <el-button @click="contactsOpen2" size="small" v-if="state.dialogOn.dialogState==2">新增</el-button>
      <el-table :data="state.contactsData" v-if="state.dialogOn.dialogState==2">
        <el-table-column width="100px" label="姓名" prop="lkmName"></el-table-column>
        <el-table-column width="100px" label="性别" prop="lkmSex"></el-table-column>
        <el-table-column width="100px" label="职位" prop="lkmPostion"></el-table-column>
        <el-table-column label="办公电话" prop="lkmTel"></el-table-column>
        <el-table-column label="手机" prop="lkmMobile"></el-table-column>
        <el-table-column label="备注" prop="lkmMemo"></el-table-column>
        <el-table-column label="操作">
          <template #default="{row}">
            <el-button @click="contactsOpen(row)" type="primary" size="small">
              编辑
            </el-button>
            <el-popconfirm
                confirm-button-text="Yes"
                cancel-button-text="No"
                icon-color="#626AEF"
                title="是否要删除？"
                @confirm="confirmEvent(row)">
             <template #reference>
               <el-button type="danger" size="small">
                 删除
               </el-button>
             </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="addSoloSocial" size="small" v-if="state.dialogOn.dialogState==3">新增</el-button>
      <el-table :data="state.records.social" v-if="state.dialogOn.dialogState==3">
        <el-table-column width="170px" label="时间" prop="atvDate"></el-table-column>
        <el-table-column width="100px" label="地点" prop="atvPlace"></el-table-column>
        <el-table-column width="100px" label="概要" prop="atvTitle"></el-table-column>
        <el-table-column label="详细信息" prop="atvDesc"></el-table-column>
        <el-table-column width="150px" label="操作">
          <template #default="{row}">
            <el-button @click="socialOpen(row)" type="primary" size="small">
              编辑
            </el-button>
            <el-popconfirm
                confirm-button-text="Yes"
                cancel-button-text="No"
                icon-color="#626AEF"
                title="是否要删除？"
                @confirm="socialconfirmEvent(row)">
              <template #reference>
                <el-button type="danger" size="small">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="AddhistoryData" style="margin-top: 10px" v-if="state.dialogOn.dialogState==4" size="small">新增</el-button>
      <el-table :data="state.history.historyData" v-if="state.dialogOn.dialogState==4">
        <el-table-column  label="订单编号" prop="odrId"></el-table-column>
        <el-table-column  label="日期" prop="odrDate"></el-table-column>
        <el-table-column  label="送货地址" prop="odrAddr"></el-table-column>
        <el-table-column label="状态" prop="odrStatus">
          <template #default="{row}">
            <span v-if="row.odrStatus==0">未回款</span>
            <span v-if="row.odrStatus==1">已回款</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" label="操作">
          <template #default="{row}">
            <el-button @click="viewhistory(row)" type="primary" size="small">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button  v-if="state.dialogOn.dialogState==1" @click="add" style="margin-top: 10px">
        保存
      </el-button>
    </el-dialog>
    <el-dialog @close="cleanContats" v-model="state.contactsSw">
    <el-descriptions
    column="2"
    border
    title="编辑联系人"
    >
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <user />
            </el-icon>
            姓名(必填)
          </div>
        </template>
        <el-input size="small" v-model="state.contactsEdit.lkmName"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <user />
            </el-icon>
            性别
          </div>
        </template>
        <el-radio-group @change="sss" v-model="state.contactsEdit.lkmSex" class="ml-4">
          <el-radio label="男" size="small">男</el-radio>
          <el-radio label="女" size="small">女</el-radio>
        </el-radio-group>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <user />
            </el-icon>
            职位
          </div>
        </template>
        <el-input size="small" v-model="state.contactsEdit.lkmPostion"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <user />
            </el-icon>
            固定电话(必填)
          </div>
        </template>
        <el-input size="small" v-model="state.contactsEdit.lkmTel"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <user />
            </el-icon>
            手机号码
          </div>
        </template>
        <el-input size="small" v-model="state.contactsEdit.lkmMobile"></el-input>
      </el-descriptions-item>
      <el-descriptions-item>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <user />
            </el-icon>
            备注
          </div>
        </template>
        <el-input type="textarea" style="width: 300px;" size="small" v-model="state.contactsEdit.lkmMemo"></el-input>
      </el-descriptions-item>
    </el-descriptions>
      <el-button @click="contactsSave" style="margin-top: 10px" v-if="state.contactsEditState==1">保存</el-button>
      <el-button @click="contactsAdd" style="margin-top: 10px" v-if="state.contactsEditState==2">添加</el-button>
    </el-dialog>
    <el-dialog>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <user />
            </el-icon>
            手机号码
          </div>
        </template>
        <el-input size="small" v-model="state.contactsEdit.lkmMobile"></el-input>
      </el-descriptions-item>
    </el-dialog>
    <el-dialog @close="socialClose" v-model="state.records.socialSw">
        <el-descriptions
        column="2"
        border
        title="编辑客户来往记录"
        >
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
               交往时间<span v-if="state.records.socialState==2">(必填)</span>
              </div>
            </template>
            <el-input :disabled="disableTOss" size="small" v-model="state.records.soloSocial.atvDate"></el-input>
          </el-descriptions-item>
          <el-descriptions-item>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                 概要(必填)
              </div>
            </template>
            <el-input size="small" v-model="state.records.soloSocial.atvTitle"></el-input>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                交往地点(必填)
              </div>
            </template>
            <el-input size="small" v-model="state.records.soloSocial.atvPlace"></el-input>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user />
                </el-icon>
                详细描述
              </div>
            </template>
            <el-input style="width: 300px;" type="textarea" size="small" v-model="state.records.soloSocial.atvDesc"></el-input>
          </el-descriptions-item>
        </el-descriptions>
      <el-button v-if="state.records.socialState==1" @click="saveSocial"  style="margin-top: 10px"   size="small">保存</el-button>
      <el-button v-if="state.records.socialState==2" @click="addSocial"  style="margin-top: 10px"   size="small">添加</el-button>
    </el-dialog>

    <el-dialog
        v-model="viewhistorySw"
        @close="viewhistorySwClose"
    >
      <el-descriptions
          column="2"
          border
          title="客户历史订单"
      >
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              订单编号
            </div>
          </template>
          {{state.history.historySolo.odrId}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              日期
            </div>
          </template>
          {{state.history.historySolo.odrDate}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              送货地址
            </div>
          </template>
          {{state.history.historySolo.odrAddr}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              总金额(元)
            </div>
          </template>
          {{Total.ss}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user />
              </el-icon>
              状态
            </div>
          </template>
          <span v-if="state.history.historySolo.odrStatus==0">未回款</span><span v-if="state.history.historySolo.odrStatus==1">已回款</span>
        </el-descriptions-item>
        <el-descriptions-item>
        </el-descriptions-item>
      </el-descriptions>
      <el-table :data="state.history.ordersLineData">
        <template v-slot:[`header.oddPrice`]>
          <span>价格</span>
          <el-button type="text" icon="el-icon-refresh-right" circle></el-button>
        </template>
        <el-table-column label="产品" prop="oddProdId">
          <template #default="{row}">
            <span v-if="row.oddProdId==21">产品A</span>
            <span v-if="row.oddProdId==22">产品B</span>
            <span v-if="row.oddProdId==23">产品C</span>
            <span v-if="row.oddProdId==24">产品D</span>
            <span v-if="row.oddProdId==25">产品E</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="oddCount"></el-table-column>
        <el-table-column label="单位" prop="oddUnit"></el-table-column>
        <el-table-column label="单价(元)" prop="oddPrice"></el-table-column>
        <el-table-column label="总金额">
          <template #default="{row}">
          {{row.oddCount * row.oddPrice}}
        </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
    v-model="state.history.historySw2">

    </el-dialog>
  </div>
</template>

<script setup>

import {reactive, onMounted, ref} from "vue";
import axios from "axios";
import {Delete, EditPen, Operation, Search, Switch, User, UserFilled} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";

const regex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

const AddhistoryData = () => {
  state.history.historySw2=true
}
const viewhistorySwClose = () => {
  Total.ss=0
}

const getOrdersLineList = () => {
  axios.get("ordersLine/loadDataList",{params:{
      oddOrderId:state.history.historySolo.odrId
    }}).then((res)=>{
      state.history.ordersLineData=res.data.data.list
    for (let i=0;state.history.ordersLineData.length;i++){
      Total.ss=(state.history.ordersLineData[i].oddCount*state.history.ordersLineData[i].oddPrice)+Total.ss
    }
  })
}
const viewhistorySw=ref(false)
const viewhistory = (row) => {
  state.history.historySolo=row
  getOrdersLineList()

  viewhistorySw.value=true
}
const Total=reactive({
  ss:0
})
const history = (row) => {
  state.editData=row
  getOrdersData()
  state.dialogOn.on_off=true
  state.dialogOn.dialogState=4
}

const getOrdersData = () => {
  axios.get("orders/loadDataList",{params:{
      odrCustomer:state.editData.custName
    }}).then((res)=>{
    state.history.historyData=res.data.data.list
  })
}
const addSocial = () => {
  if (state.records.soloSocial.atvPlace != null && state.records.soloSocial.atvPlace != "" && state.records.soloSocial.atvTitle != null && state.records.soloSocial.atvTitle != "" && state.records.soloSocial.atvDate != null && state.records.soloSocial.atvDate != "") {
    if (regex.test(state.records.soloSocial.atvDate)){
      const bean={
        atvCustNo:state.editData.custNo,
        atvCustName:state.editData.custName,
        atvDate:state.records.soloSocial.atvDate,
        atvPlace:state.records.soloSocial.atvPlace,
        atvTitle:state.records.soloSocial.atvTitle,
        atvDesc:state.records.soloSocial.atvDesc,
      }
      axios.post("cstActivity/add",bean).then((res)=>{
        if (res.data.code!=200){
          ElMessage.error(res.data.info)
          state.records.socialSw=false
        }else {
          ElMessage.success("添加成功")
        }
      })
    }else {
      ElMessage.warning("填写时间请按照这个格式,\"yyyy-MM-dd HH:mm:ss\"")
    }
  }else {
    ElMessage.warning("请填写完整!")
  }
}

const disableTOss=ref(true)

const addSoloSocial = () => {
  state.records.socialState=2
  state.records.socialSw=true
  disableTOss.value = state.records.socialState != 2;
}
const socialconfirmEvent = (row) => {
  axios.get("cstActivity/deleteCstActivityByAtvId",{params:{
      atvId:row.atvId
    }}).then((res)=>{
      if (res.data.code!=200){
        ElMessage.error(res.data.info)
      }else {
        ElMessage.success("删除成功")
        getCstActivityData()
      }
  })
}
const socialClose = () => {
  state.records.soloSocial={}
  getCstActivityData()
}
const socialOpen = (row) => {
  state.records.socialState=1
  state.records.soloSocial=row
  disableTOss.value = state.records.socialState != 2;
  state.records.socialSw=true
}

const saveSocial = () => {
  if (state.records.soloSocial.atvPlace!=null&&state.records.soloSocial.atvPlace!=""&&state.records.soloSocial.atvTitle!=null&&state.records.soloSocial.atvTitle!=""){
    const bean={
      atvId:state.records.soloSocial.atvId,
      atvPlace:state.records.soloSocial.atvPlace,
      atvTitle:state.records.soloSocial.atvTitle,
      atvDesc:state.records.soloSocial.atvDesc,
    }
    axios.post("cstActivity/updateCstActivityByAtvId2",bean).then((res)=>{
      if (res.data.code!=200){
        ElMessage.error(res.data.info)
      }else {
        ElMessage.success("修改成功")
        state.records.socialSw=false
      }

    })
  }else {
    ElMessage.warning("请填写完整!")
  }
}

const confirmEvent = (row) => {
  axios.get("cstLinkman/deleteCstLinkmanByLkmId",{params:{
      lkmId:row.lkmId
    }}).then((res)=>{
     if (res.data.code!=200){
       ElMessage.error(res.data.info)
     }else {
       ElMessage.success("删除成功")
       getCstLinkmanData()
     }
  })
}


const contactsSave = () => {
  if (state.contactsEdit.lkmName!=null&&state.contactsEdit.lkmName!=""&&state.contactsEdit.lkmTel!=null&&state.contactsEdit.lkmTel!=""){
    const bean={
      lkmId:state.contactsEdit.lkmId,
      lkmName:state.contactsEdit.lkmName,
      lkmPostion: state.contactsEdit.lkmPostion,
      lkmSex:state.contactsEdit.lkmSex,
      lkmTel:state.contactsEdit.lkmTel,
      lkmMobile:state.contactsEdit.lkmMobile,
      lkmMemo:state.contactsEdit.lkmMemo,
    }
    axios.post("cstLinkman/updateCstLinkmanByLkmId2",bean).then((res)=>{
          if (res.data.code!=200){
            ElMessage.error(res.data.info)
          }else {
            ElMessage.success("修改成功")
            getCstLinkmanData()
            state.contactsSw=false
          }
    }
    )
  }else {
      ElMessage.warning("请按照要求填写！")
  }
}
const contactsAdd = () => {
  if (state.contactsEdit.lkmName!=null&&state.contactsEdit.lkmName!=""&&state.contactsEdit.lkmTel!=null&&state.contactsEdit.lkmTel!=""){
    const bean={
      lkmCustNo:state.editData.custNo,
      lkmCustName:state.editData.custName,
      lkmPostion: state.contactsEdit.lkmPostion,
      lkmId:state.contactsEdit.lkmId,
      lkmName:state.contactsEdit.lkmName,
      lkmSex:state.contactsEdit.lkmSex,
      lkmTel:state.contactsEdit.lkmTel,
      lkmMobile:state.contactsEdit.lkmMobile,
      lkmMemo:state.contactsEdit.lkmMemo,
    }
    axios.post("cstLinkman/add",bean).then((res)=>{
          if (res.data.code!=200){
            ElMessage.error(res.data.info)
          }else {
            ElMessage.success("修改成功")
            getCstLinkmanData()
            state.contactsSw=false
          }
        }
    )
  }else {
    ElMessage.warning("请按照要求填写！")
  }
}
const cleanContats = () => {
  state.contactsEdit={}
}
const clean = () => {
  state.editData={}
  state.contactsData=[]
}
const contactsOpen = (row) => {
  state.contactsEditState=1
  state.contactsEdit=row
  state.contactsSw=true
}
const contactsOpen2 = () => {
  state.contactsEditState=2
  state.contactsSw=true
}
const edit = (row) => {
  state.editData=row
  state.dialogOn.on_off=true
  state.dialogOn.dialogState=1
}
const getCstActivityData=()=>{
  axios.get("cstActivity/loadDataList",{params:{
      atvCustNo:state.editData.custNo
  }}).then((res)=>{
      state.records.social=res.data.data.list
  })
}
const getCstLinkmanData = () => {
  axios.get("cstLinkman/loadDataList",{params:{
      lkmCustNo:state.editData.custNo
    }}).then((res)=>{
    state.contactsData=res.data.data.list
  })
}
const view = (row) => {
  state.editData=row
  state.dialogOn.on_off=true
  state.dialogOn.dialogState=2
  getCstLinkmanData()
}
const Social=(row)=>{
  state.editData=row
  state.dialogOn.on_off=true
  state.dialogOn.dialogState=3
  getCstActivityData()
}
onMounted(()=>{
  getData()
})

const add=()=>{
  const bean={
    custNo:state.editData.custNo,
    custRegion:state.editData.custRegion,
    custLevel:state.editData.custLevel,
    custSatisfy:state.editData.custSatisfy,
    custCredit:state.editData.custCredit,
    custAddr:state.editData.custAddr,
    custZip:state.editData.custZip,
    custTel:state.editData.custTel,
    custFax:state.editData.custFax,
    custWebsite:state.editData.custWebsite,
    custLicenceNo:state.editData.custLicenceNo,
    custChieftain:state.editData.custChieftain,
    custBankroll:state.editData.custBankroll,
    custTurnover:state.editData.custTurnover,
    custBank:state.editData.custBank,
    custBankAccount:state.editData.custBankAccount,
    custLocalTaxNo:state.editData.custLocalTaxNo,
    custNationalTaxNo:state.editData.custNationalTaxNo,
  }
  axios.post("cstCustomer/updateCstCustomerByCustNo2",bean).then((res)=>{
    if (res.data.code!=500){
      ElMessage.success("修改成功！")
    }else {
      ElMessage.error(res.data.info)
    }
  })
}
const getData = () => {
  state.tableLoading=true
  axios.get("/cstCustomer/loadDataList",{params:{
      pageNo:state.paging.currentPage,
      pageSize:state.paging.pageSize,
      pageTotal:state.paging.total,
      custName:state.select.custName,
      custNo:state.select.custNo,
      custLevel:state.selectValue,
      custManagerName:state.select.custManagerName,
      custAddrFuzzy:state.select.custAddrFuzzy
    }}).then((res)=>{
      state.data=res.data.data.list
      state.paging.total=res.data.data.totalCount
      state.tableLoading=false
  })
}

const handleCurrentChange = (newPage) => {
    state.paging.currentPage=newPage
  getData()
}

const state=reactive({
  history:{
    historyData:[],
    historySolo:{},
    historySw:false,
    ordersLineData:[],
    historySw2:false,
    historyAdd:{

    }
  },
  contactsEdit:{
    lkmId:"",
    lkmName:"",
    lkmSex:"男",
    lkmPostion:"",
    lkmTel:"",
    lkmMobile:"",
    lkmMemo:""
  },
  records:{
    social:[],
    socialSw:false,
    soloSocial:{},
    socialState:0
  },
  contactsEditState:"",
  contactsData:[],
  contactsSw:false,
  editData:{
  },
  select:{
    custName:"",
    custNo:"",
    custManagerName:"",
    custAddrFuzzy:""
  },
  optionItems:[
    {
      lable:"所有",
      value: null
    },
    {
      lable:"普通客户",
      value:1,
    },
    {
      lable:"银牌客户",
      value:2,
    },
    {
      lable:"金牌客户",
      value:3,
    },
    {
      lable:"钻石用户",
      value:4,
    },
    {
      lable:"超级用户",
      value:5,
    },
  ],
  optionItems2:[
    {
      lable:"普通客户",
      value:1,
    },
    {
      lable:"银牌客户",
      value:2,
    },
    {
      lable:"金牌客户",
      value:3,
    },
    {
      lable:"钻石用户",
      value:4,
    },
    {
      lable:"超级用户",
      value:5,
    },
  ],
  optionItemsAddr:[
    {
      lable:"所有",
      value: null
    },
    {
      lable:"北京",
      value:"北京",
    },
    {
      lable:"上海",
      value:"上海",
    },
    {
      lable:"广州",
      value:"广州",
    },
    {
      lable:"深圳",
      value:"深圳",
    },
    {
      lable:"成都",
      value:"成都",
    },
  ],
  optionItemsAddr2:[
    {
      lable:"北京",
      value:"北京",
    },
    {
      lable:"上海",
      value:"上海",
    },
    {
      lable:"广州",
      value:"广州",
    },
    {
      lable:"深圳",
      value:"深圳",
    },
    {
      lable:"成都",
      value:"成都",
    },
  ],
  spot:[
    {
      lable:1,
      value:1,
    },
    {
      lable:2,
      value:2,
    },
    {
      lable:3,
      value:3,
    },
    {
      lable:4,
      value:4,
    },
    {
      lable:5,
      value:5,
    },
  ],
  spot2:[
    {
      lable:20,
      value:20,
    },
    {
      lable:40,
      value:40,
    },
    {
      lable:60,
      value:60,
    },
    {
      lable:80,
      value:80,
    },
    {
      lable:100,
      value:100,
    },
  ],
  selectValue:"",
  tableLoading:true,
  data:[],
  paging:{
    pageSize:5,
    total:0,
    currentPage:1,
  },
  dialogOn:{
    on_off:false,
    dialogState:0
  }
})



</script>

<style>

</style>