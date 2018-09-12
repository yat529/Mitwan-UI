<template>
	<li class="list-item-wrapper" ref="itemWrapper"
		:class="showSublist ? 'growing-border' : ''"
		:style="`height: ${ height } + px`">
		
		<nuxt-link :to="item.link" class="list-item" v-if="item.link"
			:style="`color: ${ fontColor }; height: ${ height } + px`">

			<div class="list-item-icon mt-layout-row row-center" v-if="item.icon" >
				<mt-icon :style="`color: ${ fontColor }`"
					faStyleClass="fa-fw"
					:faName="item.icon"/>
			</div>
			
			<p class="list-item-label">{{ item.label }}</p>

			<div class="list-item-icon list-item-carret mt-layout-row row-center" v-if="item.sublist"
				:class="showSublist ? 'active' : ''"
				@click.prevent="toggleSublist">

				<mt-icon faName="fas fa-caret-left" faStyleClass="fa-fw" :style="`color: ${ fontColor }`"/>
			</div>
		</nuxt-link>

		<ul class="mt-list" v-show="showSublist">
			<list v-for="(subitem, index) in item.sublist" :key="index" :item="subitem" />
		</ul>
	</li>
</template>

<script>
export default {
	name: 'list',

  props: {

		// List Item Object
		item: {
			type: Object,
			require: true,
			default () {
				return {
						label: 'Item 2 - w/ sublist',
						icon: '',
						link: '',
						sublist: [
							{ label: 'Sub-Item 1', icon: '', link: '' },
							{ label: 'Sub-Item 2', icon: '', link: '' },
							{ label: 'Sub-Item 3', icon: '', link: '' },
						]
				}
			}
		},

		// font color
		fontColor: {
			type: String,
			require: false,
			default: 'white'
		},

		// list item height
		height: {
			type: [String, Number],
			require: false,
			default: 46
		}
	},

	data () {
		return {
			showSublist: false,
		}
	},

	methods: {
		/* 
		** Toggle sublist
		*/
		toggleSublist () {			
			this.showSublist = !this.showSublist

			this.$nextTick(() => {
				this.adjustHeight(this.showSublist)
			})
		},

		/* 
		** Adjust Item Wrapper Height
		** Note
		*/
		adjustHeight (status) {
			let $itemWrapper = this.$refs.itemWrapper

			if (status) {
				$itemWrapper.style.height = (this.item.sublist.length + 1) * this.height +'px'
			} else {
				$itemWrapper.style.height = this.height +'px'
			}
		},

	}
}
</script>

<style lang="scss">
$easing: cubic-bezier(0.25, 0.46, 0.45, 0.94); 

.list-item-wrapper {
	position: relative;
	margin: 0px;
	padding: 0px;
	width: 100%;
	height: 46px;
	list-style-type: none;
	transition: height 0.3s $easing;
	// wait til border animation ends
	transition-delay: 0.35s;
	// ----
	will-change: height;
	overflow: hidden;

	&::before, &::after {
		content: '';
		position: absolute;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 1px;
		background: white;
		opacity: 0.5;
		transition: transform 0.3s $easing;
		will-change: transform;
	}

	&::before {
		transform: translateX(-100%);
	}

	&::after {
		top: auto;
		bottom: 0px;
		transform: translateX(100%);
	}

	&.growing-border {
		&::before, &::after {
			transform: translateX(0%);
		}
	}

	.list-item {
		display: flex;
		align-items: center;
		position: relative;
		width: 100%;
		height: 46px;
		text-decoration: none;
		line-height: 1;
		overflow: hidden;
		z-index: 1;

		.list-item-icon {
			flex: 0;
			position: absolute;
			top: 0px;
			left: 25px;
			width: 30px;
			height: 100%;
			pointer-events: none;

			&.list-item-carret {
				justify-content: flex-end;
				left: 0px;
				padding-right: 20px;
				width: 100%;
				pointer-events: auto;
				z-index: 3;

				i {
					transition: transform 0.3s;
				}

				&.active {
					i {
						transform: rotate(-90deg);
					}
				}

			}
		}

		.list-item-label {
			flex: 1;
			padding: 15px 60px;
			text-align: left;
		}
	}
}
</style>

