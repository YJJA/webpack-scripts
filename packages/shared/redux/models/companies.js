import request from '../../server/request'
import {mapData, updateDataOne, deleteData} from '../../lib/helpers'

// action types
const LOAD = 'mw/companies/LOAD'
const LOAD_SUCCESS = 'mw/companies/LOAD_SUCCESS'
const LOAD_FAILURE = 'mw/companies/LOAD_FAILURE'

const INSERT = 'mw/companies/INSERT'
const INSERT_SUCCESS = 'mw/companies/INSERT_SUCCESS'
const INSERT_FAILURE = 'mw/companies/INSERT_FAILURE'

const INSERT_PAY = 'mw/companies/INSERT_PAY'
const INSERT_PAY_SUCCESS = 'mw/companies/INSERT_PAY_SUCCESS'
const INSERT_PAY_FAILURE = 'mw/companies/INSERT_PAY_FAILURE'

const UPDATE = 'mw/companies/UPDATE'
const UPDATE_SUCCESS = 'mw/companies/UPDATE_SUCCESS'
const UPDATE_FAILURE = 'mw/companies/UPDATE_FAILURE'

const DELETE = 'mw/companies/DELETE'
const DELETE_SUCCESS = 'mw/companies/DELETE_SUCCESS'
const DELETE_FAILURE = 'mw/companies/DELETE_FAILURE'

const STATUS = 'mw/companies/STATUS'
const STATUS_SUCCESS = 'mw/companies/STATUS_SUCCESS'
const STATUS_FAILURE = 'mw/companies/STATUS_FAILURE'

const DETAIL = 'mw/companies/DETAIL'
const DETAIL_SUCCESS = 'mw/companies/DETAIL_SUCCESS'
const DETAIL_FAILURE = 'mw/companies/DETAIL_FAILURE'

const PUBLIC_DATA = 'mw/companies/PUBLIC_DATA'
const PUBLIC_DATA_SUCCESS = 'mw/companies/PUBLIC_DATA_SUCCESS'
const PUBLIC_DATA_FAILURE = 'mw/companies/PUBLIC_DATA_FAILURE'

const INDUSTRY = 'mw/companies/INDUSTRY'
const INDUSTRY_SUCCESS = 'mw/companies/INDUSTRY_SUCCESS'
const INDUSTRY_FAILURE = 'mw/companies/INDUSTRY_FAILURE'

const PROVINCE = 'mw/companies/PROVINCE'
const PROVINCE_SUCCESS = 'mw/companies/PROVINCE_SUCCESS'
const PROVINCE_FAILURE = 'mw/companies/PROVINCE_FAILURE'

const CITY = 'mw/companies/CITY'
const CITY_SUCCESS = 'mw/companies/CITY_SUCCESS'
const CITY_FAILURE = 'mw/companies/CITY_FAILURE'

const BANK_CITY = 'mw/companies/BANK_CITY'
const BANK_CITY_SUCCESS = 'mw/companies/BANK_CITY_SUCCESS'
const BANK_CITY_FAILURE = 'mw/companies/BANK_CITY_FAILURE'

const COUNTY = 'mw/companies/COUNTY'
const COUNTY_SUCCESS = 'mw/companies/COUNTY_SUCCESS'
const COUNTY_FAILURE = 'mw/companies/COUNTY_FAILURE'

const HEAD_BANK = 'mw/companies/HEAD_BANK'
const HEAD_BANK_SUCCESS = 'mw/companies/HEAD_BANK_SUCCESS'
const HEAD_BANK_FAILURE = 'mw/companies/HEAD_BANK_FAILURE'

const BRANCH_BANK = 'mw/companies/BRANCH_BANK'
const BRANCH_BANK_SUCCESS = 'mw/companies/BRANCH_BANK_SUCCESS'
const BRANCH_BANK_FAILURE = 'mw/companies/BRANCH_BANK_FAILURE'

const CHECK_USCC = 'mw/companies/CHECK_USCC'
const CHECK_USCC_SUCCESS = 'mw/companies/CHECK_USCC_SUCCESS'
const CHECK_USCC_FAILURE = 'mw/companies/CHECK_USCC_FAILURE'

const ALL_COMPANY = 'mw/companies/ALL_COMPANY'
const ALL_COMPANY_SUCCESS = 'mw/companies/ALL_COMPANY_SUCCESS'
const ALL_COMPANY_FAILURE = 'mw/companies/ALL_COMPANY_FAILURE'

const initialState = {
  isFetching: false,
  byId: {},
  allIds: [],
  error: null,
  companyDetail: {},
  publicData: {},
  industryList: [],
  firstAddPage: {},
  provinceList: [],
  cityList: [],
  countyList: [],
  headBankList: [],
  branchBankList: [],
  isUsccUnique: true,
  bankCityList: [],
  allCompanyList: []
}

// 获取公司详情
const fetchCompanyDetail = (state, payload, id = 'id') => {
  const detail = payload.data || {}
  state.companyDetail = detail
  state.companyDetail.logoPic = state.companyDetail.companyLogo || null
  // fetchCities(detail.provinceId)
}
// 获取公共数据，公司性质列表，公司规模列表，所属行业列表
const fetchPublicData = (state, payload, id = 'id') => {
  const data = payload.data || []
  state.publicData = data
}
// 获取所属行业列表
const fetchIndustry = (state, payload, id = 'id') => {
  const data = payload.data || []
  state.industryList = data.INDUSTRY
}
// 获取所有省
const fetchProvinceList = (state, payload, id = 'id') => {
  const data = payload.data || []
  state.provinceList = data
}
// 获取市
const fetchCityList = (state, payload, id = 'id') => {
  const data = payload.data || []
  state.cityList = data
}
// 获取区
const fetchCountyList = (state, payload, id = 'id') => {
  const data = payload.data || []
  state.countyList = data
}
// 获取开户总行
const fetchHeadBankList = (state, payload, id = 'id') => {
  const data = payload.data || []
  state.headBankList = data
}
// 获取开户分行
const fetchBranchBankList = (state, payload, id = 'id') => {
  const data = payload.data || []
  state.branchBankList = data
}
// 获取
const fetchBankCityList = (state, payload, id = 'id') => {
  const data = payload.data || []
  state.bankCityList = data
}
// 设置第一页的表单各参数到redux里
const setAddData = (state, data) => {
  state.firstAddPage = data
}
const setUsccExist = (state, data) => {
  state.isUsccUnique = data.data.isUnique
}
const setAllCompany = (state, payload) => {
  console.log('--------------')
  console.log(payload)
  const data = payload.data || []
  console.log(data)
  state.allCompanyList = data
}
// reducer
export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
    case INSERT_PAY:
    case UPDATE:
    case DELETE:
    case STATUS:
    case DETAIL:
    case PUBLIC_DATA:
    case INDUSTRY:
      return {...state, isFetching: true, error: null}

    case PROVINCE:
    case CITY:
    case COUNTY:
    case HEAD_BANK:
    case BRANCH_BANK:
    case CHECK_USCC:
    case BANK_CITY:
    case ALL_COMPANY:
      return {...state, isFetching: false, error: null}

    case INSERT:
      return {
        ...state,
        ...setAddData(state, action.data),
        isFetching: false
      }
    case LOAD_FAILURE:
    case INSERT_FAILURE:
    case INSERT_PAY_FAILURE:
    case UPDATE_FAILURE:
    case DELETE_FAILURE:
    case STATUS_FAILURE:
    case DETAIL_FAILURE:
    case PUBLIC_DATA_FAILURE:
    case INDUSTRY_FAILURE:
    case PROVINCE_FAILURE:
    case CITY_FAILURE:
    case COUNTY_FAILURE:
    case HEAD_BANK_FAILURE:
    case BRANCH_BANK_FAILURE:
    case CHECK_USCC_FAILURE:
    case BANK_CITY_FAILURE:
    case ALL_COMPANY_FAILURE:
      return {...state, isFetching: false, error: action.error}

    case LOAD_SUCCESS:
      return {
        ...state,
        ...mapData(state, action.data, 'id'),
        isFetching: false
      }
    case DETAIL_SUCCESS:
      return {
        ...state,
        ...fetchCompanyDetail(state, action.data, 'id'),
        isFetching: false
      }
    case PUBLIC_DATA_SUCCESS:
      return {
        ...state,
        ...fetchPublicData(state, action.data),
        isFetching: false
      }

    case PROVINCE_SUCCESS:
      return {
        ...state,
        ...fetchProvinceList(state, action.data),
        isFetching: false
      }

    case CITY_SUCCESS:
      return {
        ...state,
        ...fetchCityList(state, action.data),
        isFetching: false
      }

    case BANK_CITY_SUCCESS:
      return {
        ...state,
        ...fetchBankCityList(state, action.data),
        isFetching: false
      }

    case COUNTY_SUCCESS:
      return {
        ...state,
        ...fetchCountyList(state, action.data),
        isFetching: false
      }

    case HEAD_BANK_SUCCESS:
      return {
        ...state,
        ...fetchHeadBankList(state, action.data),
        isFetching: false
      }
    case BRANCH_BANK_SUCCESS:
      return {
        ...state,
        ...fetchBranchBankList(state, action.data),
        isFetching: false
      }
    case CHECK_USCC_SUCCESS:
      return {
        ...state,
        ...setUsccExist(state, action.data),
        isFetching: false
      }
    case ALL_COMPANY_SUCCESS:
      return {
        ...state,
        ...setAllCompany(state, action.data),
        isFetching: false
      }

    case INSERT_SUCCESS:
    case INSERT_PAY_SUCCESS:
    case UPDATE_SUCCESS:
    case STATUS_SUCCESS:
      return {
        ...state,
        ...updateDataOne(state, action.data, 'id'),
        isFetching: false
      }

    case DELETE_SUCCESS:
      return {
        ...state,
        ...deleteData(state, action.propertId, 'id'),
        isFetching: false
      }

    default:
      return state
  }
}

// actions
export const fetchCompanies = query => dispatch => {
  dispatch({type: LOAD})
  return request
    .get('/manufactory/backCompany')
    .query(query)
    .then(data => dispatch({type: LOAD_SUCCESS, data}))
    .catch(error => {
      dispatch({type: LOAD_FAILURE, error})
      throw error
    })
}

export const insertCompanies = body => dispatch => {
  dispatch({type: INSERT, data: body})
}

export const updateCompanies = (body) => dispatch => {
  dispatch({type: UPDATE})
  return request
    .put(`/manufactory/backCompany`)
    .send(body)
    .then(data => dispatch({type: UPDATE_SUCCESS, data}))
    .catch(error => {
      dispatch({type: UPDATE_FAILURE, error})
      throw error
    })
}

export const fetchCompaniesDetail = (id) => dispatch => {
  dispatch({type: DETAIL})
  return request
    .get(`/manufactory/backCompany/${id}`)
    .then(data => dispatch({type: DETAIL_SUCCESS, data}))
    .catch(error => {
      dispatch({type: DETAIL_FAILURE, error})
      throw error
    })
}
// 获取所属行业
export const fetchCompanyIndustry = (query) => dispatch => {
  dispatch({type: INDUSTRY})
  return request
    .get(`/manufactory/datas?dataType=INDUSTRY`)
    .query(query)
    .then(data => dispatch({type: INDUSTRY_SUCCESS, data}))
    .catch(error => {
      dispatch({type: INDUSTRY_FAILURE, error})
      throw error
    })
}

// 获取省
export const fetchProvinces = (query) => dispatch => {
  dispatch({type: PROVINCE})
  return request
    .get(`/manufactory/provinces`)
    .query(query)
    .then(data => dispatch({type: PROVINCE_SUCCESS, data}))
    .catch(error => {
      dispatch({type: INDUSTRY_FAILURE, error})
      throw error
    })
}

// 获取省下的市
export const fetchCities = (id) => dispatch => {
  console.log(id)
  dispatch({type: CITY})
  return request
    .get(`/manufactory/province/${id}/cities`)
    .then(data => dispatch({type: CITY_SUCCESS, data}))
    .catch(error => {
      dispatch({type: CITY_FAILURE, error})
      throw error
    })
}
// 获取市下的区
export const fetchCounties = (id) => dispatch => {
  dispatch({type: COUNTY})
  return request
    .get(`/manufactory/city/${id}/counties`)
    .then(data => dispatch({type: COUNTY_SUCCESS, data}))
    .catch(error => {
      dispatch({type: COUNTY_FAILURE, error})
      throw error
    })
}
// 获取开户总行
export const fetchHeadBanks = (query) => dispatch => {
  dispatch({type: HEAD_BANK})
  return request
    .get(`/pay/bank/backBankCodes`)
    .query(query)
    .then(data => dispatch({type: HEAD_BANK_SUCCESS, data}))
    .catch(error => {
      dispatch({type: HEAD_BANK_FAILURE, error})
      throw error
    })
}
// 获取开户支行
export const fetchBranchBanks = (query) => dispatch => {
  dispatch({type: BRANCH_BANK})
  return request
    .get(`/pay/bank/branchInfos`)
    .query(query)
    .then(data => dispatch({type: BRANCH_BANK_SUCCESS, data}))
    .catch(error => {
      dispatch({type: BRANCH_BANK_FAILURE, error})
      throw error
    })
}
export const fetchBankCities = (id) => dispatch => {
  console.log(id)
  dispatch({type: BANK_CITY})
  return request
    .get(`/manufactory/province/${id}/cities`)
    .then(data => dispatch({type: BANK_CITY_SUCCESS, data}))
    .catch(error => {
      dispatch({type: BANK_CITY_FAILURE, error})
      throw error
    })
}
export const fetchPublic = (query) => dispatch => {
  dispatch({type: PUBLIC_DATA})
  return request
    .get(`/manufactory/datas?dataType=COMPANY_NATURE&dataType=COMPANY_SCALE&dataType=INDUSTRY`)
    .query(query)
    .then(data => dispatch({type: PUBLIC_DATA_SUCCESS, data}))
    .catch(error => {
      dispatch({type: PUBLIC_DATA_FAILURE, error})
      throw error
    })
}

// 启用或停用公司
export const setCompanyEnable = (id, status) => dispatch => {
  dispatch({type: STATUS})
  return request
    .put(`/manufactory/backCompany/isEnable/${id}/${status}`)
    .then(data => dispatch({type: STATUS_SUCCESS, id, data}))
    .catch(error => {
      dispatch({type: STATUS_FAILURE, error})
      throw error
    })
}

// 新增公司（包含支付）
export const insertCompanyPay = body => dispatch => {
  dispatch({type: INSERT_PAY})
  return request
    .post('/manufactory/backCompany')
    .send(body)
    .then(data => dispatch({type: INSERT_PAY_SUCCESS, data}))
    .catch(error => {
      dispatch({type: INSERT_PAY_FAILURE, error})
      throw error
    })
}

export const checkUsccExist = (uscc) => dispatch => {
  dispatch({type: CHECK_USCC})
  return request
    .get(`/manufactory/backCompany/isUnique/${uscc}`)
    .then(data => dispatch({type: CHECK_USCC_SUCCESS, data}))
    .catch(error => {
      dispatch({type: CHECK_USCC_FAILURE, error})
      throw error
    })
}
// 查询所有公司
export const getAllCompanyList = () => dispatch => {
  dispatch({type: ALL_COMPANY})
  return request
    .get(`/manufactory/backCompany/getAllList`)
    .then(data => dispatch({type: ALL_COMPANY_SUCCESS, data}))
    .catch(error => {
      dispatch({type: ALL_COMPANY_FAILURE, error})
      throw error
    })
}
