<template>
    <div>
        other {{msg}}
    </div>
</template>

<script>
export default {
    data() {
        return {
            msg: "hhh"
        }
    },

    created() {
        this.msg = "123"
    },

    mounted() {
        this.msg = "456";
    }
}
</script>

<style>

</style>

