<template>
  <b-card
      tag="article"
      no-body
  >
    <b-card-header>
      <b-card-title>
        <b-link
            :to="{ name: 'pipelineDetails', params: { id:pipelineId}}"
            class="text-body text-body-heading"
        >
          {{ pipelineName }}
        </b-link>
      </b-card-title>
      <b-card-text class="mr-25 mb-0">
        <b-badge
            pill
            :variant="pipelineType===1?'success':'primary'"
        >
          {{ pipelineType === 1 ? '前端流水线' : '后端流水线' }}
        </b-badge>
      </b-card-text>
    </b-card-header>
    <b-card-body>
      <b-media no-body>
        <b-media-aside

            class="mr-2"
        >
          <b-avatar
              size="25"
              :variant="color"
          >
            <feather-icon
                size="20"
                :icon="icon"
            />
          </b-avatar>
        </b-media-aside>
        <b-media-body>
          <b-row>
            <b-col sm="4">
              <small class="text-muted mr-50">服务</small>
              <small>
                <b-link class="text-body">{{ service }}</b-link>
              </small>
            </b-col>
            <b-col sm="4">
              <small class="text-muted mr-50">历史发布次数</small>
              <small>
                <b-link class="text-body">{{ latestJob }}</b-link>
              </small>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="4">
              <small class="text-muted mr-50">责任人</small>
              <small>
                <b-link class="text-body">{{ defender }}</b-link>
              </small>
            </b-col>
            <b-col sm="4">
              <small class="text-muted mr-50">创建时间</small>
              <small>
                <b-link class="text-body">{{ createTime }}</b-link>
              </small>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="4">
              <small class="text-muted mr-50">配置ID</small>
              <small>
                <b-link class="text-body">{{ configId }}</b-link>
              </small>
            </b-col>
            <b-col sm="4">
              <small class="text-muted mr-50">更新时间</small>
              <small>
                <b-link class="text-body">{{ updateTime }}</b-link>
              </small>
            </b-col>
          </b-row>
        </b-media-body>
      </b-media>
      <hr>
      <b-row>
        <b-col md="10">
          <small class="text-muted mr-50">备注</small>
          <small></small>
        </b-col>
        <b-col md="2" class="d-flex justify-content-between align-items-center">
          <feather-icon
              :id="`editIcon-${pipelineId}`"
              icon="EditIcon"
              size="16"
              class="mx-1"
              @click="showEditModal(2,props.row)"
          />
          <b-tooltip
              placement="topright"
              title="编辑"
              :target="`editIcon-${pipelineId}`"
          />
          <feather-icon
              :id="`deleteIcon-${pipelineId}`"
              icon="TrashIcon"
              size="16"
              class="mx-1"
              @click="deletePipeline(props.row)"
          />
          <b-tooltip
              placement="topright"
              title="删除"
              :target="`deleteIcon-${pipelineId}`"
          />
          <b-dropdown variant="link" toggle-class="text-decoration-none" no-caret>
            <template v-slot:button-content>
              <feather-icon icon="MoreVerticalIcon" size="16" class="text-body align-middle mr-25"/>
            </template>
            <b-dropdown-item @click="runPipeline(props)">
              <feather-icon icon="Edit2Icon" class="mr-50"/>
              <span>从代码执行</span>
            </b-dropdown-item>
            <b-dropdown-item @click="runHisPipeline(props)">
              <feather-icon icon="FileTextIcon" class="mr-50"/>
              <span>从镜像执行</span>
            </b-dropdown-item>
            <b-dropdown-item @click="showHistory(props)">
              <feather-icon icon="FileTextIcon" class="mr-50"/>
              <span>发布历史</span>
            </b-dropdown-item>
            <b-dropdown-item>
              <feather-icon icon="FileTextIcon" class="mr-50"/>
              <span>质量报告</span>
            </b-dropdown-item>
          </b-dropdown>
        </b-col>
      </b-row>
    </b-card-body>
  </b-card>
</template>

<script>
import { BCard, BCardBody, BAvatar } from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BCardBody,
    BAvatar,
  },
  props: {
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'primary',
    },
    pipelineId: {
      type: [Number, String],
      required: true,
    },
    pipelineName: {
      type: String,
      default: '',
    },
    pipelineType: {
      type: Number,
      default: 1,
    },
    service: {
      type: String,
      default: '',
    },
    defender: {
      type: String,
      default: '',
    },
    latestJob: {
      type: String,
      default: '',
    },
    configId: {
      type: String,
      default: '',
    },
    createTime: {
      type: String,
      default: '',
    },
    updateTime: {
      type: String,
      default: '',
    },
  },
  computed: {},
  methods: {
    gradientToColor(color) {
      const gradientToColors = {
        primary: '#A9A2F6',
        success: '#55DD92',
        warning: '#ffc085',
        danger: '#F97794',
        info: '#59E0F0',
        secondary: '#B4B9BF',
        light: '#D0D4DB',
        dark: '#919191',
      }

      return gradientToColors[color]
    },
  },
}
</script>
