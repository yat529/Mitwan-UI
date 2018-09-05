<template>
	<div class="hamburger" :class="active ? 'active' : ''" @click="toggle">
		<span class="bar top" :style="`background-color: ${ color };`"></span>
		<span class="bar middle" :style="`background-color: ${ color };`"></span>
		<span class="bar bottom" :style="`background-color: ${ color };`"></span>
	</div>
</template>

<script>
export default {
	props: {

		// bar clolr
		color: {
			type: String,
			require: true,
			default: 'white'
		}

	},

	data () {
		return {
			active: false,
		}
	},

	methods: {
		toggle () {
			this.active = !this.active
			this.$emit('toggle', this.active)
		}
	}
}
</script>


<style lang="scss" scoped>
.hamburger {
	display: inline-block;
	cursor: pointer;

	.bar {
		display: block;
		width: 18px;
		height: 2px;
		margin-bottom: 3px;
		background: black;
		transform-origin: center;
		transition: all 0.2s ease-out;
		opacity: 1;

		&:last-child {
			margin-bottom: 0px;
		}
	}

	&.active {
		.bar {
			&.top {
				transform: translateY(5px) rotate(45deg);
			}
			&.middle {
				opacity: 0;
			}
			&.bottom {
				transform: translateY(-5px) rotate(-45deg);
			}

		}
	}
}
</style>

