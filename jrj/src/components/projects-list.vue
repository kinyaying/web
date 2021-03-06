<style lang="scss" scoped>
@import '../assets/css/reset.css';
.projects-list {
    width: 100%;
}
</style>
<template>
<div class="projects-list" ref="panel" :style="{height:height+ 'px'}">
  Loading...
</div>
</template>

<script>
import {
  mapState
} from 'vuex'
import moment from 'moment'

export default {
  props: ['nickname', 'finish'],
  data () {
    return {
      height: 0
    }
  },
  computed: mapState({
    projects: state => state.projects.list
  }),
  components: {},
  methods: {},
  mounted () {
    const echarts = require('echarts')
    let chart = null
    const today = moment().startOf('day')
    this.$watch('projects', projects => {
      let min = today
      if (chart) {
        chart.dispose()
      }
      const usernames = []
      projects.forEach(prj => {
        if (prj.user) {
          if (usernames.indexOf(prj.user.nickname) === -1) {
            usernames.push(prj.user.nickname)
          }
        } else {
          if (usernames.indexOf('未分配') === -1) {
            usernames.push('未分配')
          }
        }
        const start = moment(prj.start).startOf('day')
        if (start < min) {
          min = start
        }
      })
      this.height = 200 + ((this.nickname ? projects : usernames) || []).length * 30
      setTimeout(() => {
        chart = echarts.init(this.$refs.panel)
        chart.on('click', params => {
          if (!this.nickname) {
            const nickname = params.value[1]
            this.$router.push(`/demo/projects/${nickname}${location.search}`)
          }
        })

        const series = []
        // 把短线放在上面，避免被长线遮挡住
        projects.concat([]).sort((a, b) => {
          return -((moment(a.end) - moment(a.start)) - (moment(b.end) - moment(b.start)))
        }).forEach(prj => {
          const start = moment(prj.start).startOf('day')
          const end = moment(prj.end).endOf('day')
          const username = prj.user ? prj.user.nickname : '未分配'
          if (start > min) {
            // 占位条都放在最前面，避免遮挡可见条
            series.unshift({
              type: 'bar',
              barGap: '0%',
              stack: prj.name,
              itemStyle: {
                normal: {
                  opacity: 0
                },
                emphasis: {
                  opacity: 0
                }
              },
              data: [
                [start.toDate(), username]
              ]
            })
          }
          series.push({
            type: 'bar',
            barGap: '-100%',
            stack: prj.name,
            itemStyle: {
              normal: {
                opacity: 0.8
              },
              emphasis: {
                opacity: 0.8
              }
            },
            name: prj.name,
            data: [
              [end.toDate(), this.nickname ? prj.name : username]
            ],
            markLine: {
              data: [{
                name: 'Y 轴值为 100 的水平线',
                xAxis: today.toDate(),
                lineStyle: {
                  normal: {
                    type: 'solid'
                  }
                },
                label: {
                  normal: {
                    formatter () {
                      return '今天'
                    }
                  }
                }
              }]
            }
          })
        })
        chart.setOption({
          title: {
            text: '当前项目进度',
            subtext: this.nickname
          },
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              if (params.seriesName !== ' -') {
                const prj = projects.filter((prj) => {
                  return prj.name === params.seriesName
                })[0]
                return `${params.seriesName}: ${moment(prj.start).format('YYYY/MM/DD')} - ${moment(prj.end).format('YYYY/MM/DD')} (${prj.desc || '开发中'})`
              }
            },
            axisPointer: {
              type: 'shadow'
            }
          },
          xAxis: {
            type: 'time',
            min: this.nickname ? min.toDate() : min.toDate()
          },
          yAxis: {
            type: 'category',
            data: (this.nickname ? projects.map(prj => prj.name) : usernames).reverse()
          },
          series: series
        })
      })
    })
    this.$watch('nickname', () => {
      this.$store.dispatch('projects/fetch', {
        nickname: this.nickname,
        finish: this.finish
      })
    })
    this.$watch('finish', () => {
      this.$store.dispatch('projects/fetch', {
        nickname: this.nickname,
        finish: this.finish
      })
    })
    this.$store.dispatch('projects/fetch', {
      nickname: this.nickname,
      finish: this.finish
    })
  }
}
</script>
