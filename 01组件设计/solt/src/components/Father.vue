<template>
    <div>
        <s-index-layout>
            <template v-slot:header>
                hahah
            </template>
            <template v-slot:default>
                xixii
            </template>
            <template v-slot:footer>
                lilili
            </template>
        </s-index-layout>
    </div>
</template>
<script>
import SIndexLayout from './SIndexLayout.vue'

export default {
  components: {
    SIndexLayout
  }
}
</script>