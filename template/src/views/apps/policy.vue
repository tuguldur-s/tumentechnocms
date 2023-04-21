<template>
	<div class="page-timeline scrollable only-y">
		<div class="page-header">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: '/' }"><i class="mdi mdi-home-outline"></i></el-breadcrumb-item>
				<el-breadcrumb-item>Дотоод журам, стандарт</el-breadcrumb-item>
			</el-breadcrumb>
		</div>

		<div class="timeline-box card-base card-shadow--medium">
            <h5 style="margin-top: -10px;">Байгууллагын дотоод журам, стандарт</h5>
            <el-collapse v-model="activeTag" accordion>
                <el-collapse-item name="1">
                    <template slot="title">
                        <span style="font-weight: 700; color: #2d6dd3;">НЭГ. БАРАА БУЦААХ ЖУРАМ</span>
                        <!-- <i class="header-icon el-icon-info"></i> -->
                    </template>
                    <div>Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;</div>
                    <div>Consistent within interface: all elements should be consistent, such as: design style, icons and texts, position of elements, etc.</div>
                </el-collapse-item>
                <el-collapse-item name="2">
                    <template slot="title">
                        <span style="font-weight: 700; color: #2d6dd3;">ХОЁР. ҮЙЛЧИЛГЭЭНИЙ СТАНДАРТ</span>
                        <!-- <i class="header-icon el-icon-info"></i> -->
                    </template>
                    <div>Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects;</div>
                    <div>Visual feedback: reflect current state by updating or rearranging elements of the page.</div>
                </el-collapse-item>
                <el-collapse-item name="3">
                    <template slot="title">
                        <span style="font-weight: 700; color: #2d6dd3;">ГУРАВ. ҮНЭЛГЭЭНИЙ СИСТЕМ - ТАСАГ ОРХИЛТ</span>
                        <!-- <i class="header-icon el-icon-info"></i> -->
                    </template>
                    <div>Simplify the process: keep operating process simple and intuitive;</div>
                    <div>Definite and clear: enunciate your intentions clearly so that the users can quickly understand and make decisions;</div>
                    <div>Easy to identify: the interface should be straightforward, which helps the users to identify and frees them from memorizing and recalling.</div>
                </el-collapse-item>
                <el-collapse-item name="4">
                    <template slot="title">
                        <span style="font-weight: 700; color: #2d6dd3;">ДӨРӨВ. ҮЙЛЧИЛГЭЭНИЙ 6 АЛТАН ДҮРЭМ</span>
                        <!-- <i class="header-icon el-icon-info"></i> -->
                    </template>
                    <div>Decision making: giving advices about operations is acceptable, but do not make decisions for the users;</div>
                    <div>Controlled consequences: users should be granted the freedom to operate, including canceling, aborting or terminating current operation.</div>
                </el-collapse-item>
                <el-collapse-item name="5">
                    <template slot="title">
                        <span style="font-weight: 700; color: #2d6dd3;">ТАВ. ҮЙЛЧИЛГЭЭНИЙ СТАНДАРТАНД МӨРДӨХ 10 ЗҮЙЛ</span>
                        <!-- <i class="header-icon el-icon-info"></i> -->
                    </template>
                    <div>Decision making: giving advices about operations is acceptable, but do not make decisions for the users;</div>
                    <div>Controlled consequences: users should be granted the freedom to operate, including canceling, aborting or terminating current operation.</div>
                </el-collapse-item>
            </el-collapse>
		</div>
	</div>
</template>

<script>
import { Timeline, TimelineItem, TimelineTitle } from 'vue-cute-timeline'

export default {
    data() {
        return {
            activeTag : '1'
        }
    },
	name: 'TimelinePage',
	mounted() {
		//console.log('Timeline mounted')
	},
	components: {
		Timeline,
		TimelineItem,
		TimelineTitle
	}
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/_variables';

.timeline-box {
	padding: 40px;
}
.timeline {
	max-width: 1200px;
	margin: 0px auto;
	font-family: inherit;
}
.timeline, .timeline-title {
	color: $text-color;
	line-height: 1.4;
	cursor: default;
}
.append {
    font-size: .8em;
    margin-top: 3px;
    color: transparentize($text-color, .5);
}
.icon-time {
	width: 32px;
	margin-top: 2px;
	border-radius: 50%;
}
</style>

