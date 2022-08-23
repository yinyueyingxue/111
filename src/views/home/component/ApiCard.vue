<template>
  <b-card  no-body>
    <b-card-body>
      <b-media no-body>
        <b-media-aside vertical-align="center" class="mr-150">
          <b-avatar variant="light-primary" size="60">
            <feather-icon size="35" :icon="api.icon" />
          </b-avatar>
        </b-media-aside>

        <b-media-body class="apiCardMediaBody" style="height: 60px">
          <b-card-text class="font-weight-bolder">{{ api.name }}</b-card-text>
          <small class="text-body font-weight-bolder">{{ api.comments }}</small>
        </b-media-body>
      </b-media>

      <!-- <b-col class="d-flex flex-column align-items-start">
        <b-row>
          <b-col>
            <small class="text-body font-weight-bolder">{{ api.comments }}</small>
          </b-col>
        </b-row>
      </b-col> -->

      <hr>

      <div class="d-flex justify-content-between align-items-center">
        <b-badge variant="success" style="font-size: small">{{ api.typeName }}</b-badge>
        <small class="text-body mr-50 ">访问次数：<span style="color: salmon">{{ api.usedCount }}</span></small>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  name: 'card',
  props: {
    api: {
      type: Object
    },
    type: {
      type: String
    }
  },
  methods: {
    toApi(viewId) {
      this.$router.push({
        path: '/api/describe?apiId=' + viewId
      })
    },
    getComment(comments) {
      if (comments) {
        const comment = String(comments)
        if (comment.length > 15) {
          return comment.slice(0, 15) + '...'
        } else {
          return comment
        }
      } else {
        return ''
      }
    }
  }
}
</script>

<style>
  .card-text.head {
    display: inline-flex;
  }

  .card-text .icon {
    display: inline;
  }

  .card-text .text {
    display: inline-flex;
    text-align: left;
    font-size: 20px;
    padding-left: 7px;
    align-items: center;
    top: 50%;
  }

  .card-text.label {
    width: fit-content;
    border: 1px solid #c4ccd3;
    text-align: center;
    padding: 0 8px;
    margin: 0 1px;
    border-radius: 3px;
    background-color: rgba(246, 246, 248, 0.22);
  }

  .icon-card.text-center {
    border: 1px solid #0000FF00;
  }

  .icon-card.text-center:hover {
    cursor: pointer;
    border: 1px solid #3b99f1;
    /*border: 1px solid #4cd964;*/
  }

  .icon-card.text-center:hover .head {
    color: #3b99f1;
  }

  .apiCardMediaBody {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
  }
</style>
