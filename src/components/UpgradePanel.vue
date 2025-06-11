<template>
  <div class="upgrade-panel">
    <p>
      You have hit the rate limit. Please
      <a class="upgrade-link">Upgrade</a>
      to keep chatting, or you can continue coding for free in the editor.
    </p>
  </div>
</template>

<script setup lang="ts">
// Component logic can be added here
</script>

<style scoped>
.upgrade-panel {
  padding: 1rem;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.upgrade-link {
  color: #007bff;
  text-decoration: none;
}

.upgrade-link:hover {
  text-decoration: underline;
}
</style>
