<template>
  <div class="home h-screen">
    <div class="container mx-auto w-8/12">
      <h1 class="text-center text-4xl mb-4">The Tasks Lists</h1>
      <Vueform size="lg" :endpoint="createTasks" class="pb-5"
        ><!-- Task input -->
        <TextElement
          name="task"
          placeholder="Add a task"
          floating="Task name"
          rules="required"
        />
        <!-- Task type -->
        <RadiogroupElement
          name="type"
          :items="['Personal', 'Business']"
          view="tabs"
          default="Personal"
        />
        <!-- Submit -->
        <ButtonElement name="button" align="right" submits>
          Submit
        </ButtonElement></Vueform
      >
      <hr />
      <!-- task list -->
      <Vueform v-model="taskModel" sync class="pt-5">
        <ListElement
          name="tasks"
          :controls="{ add: false }"
          sort
          @sort="syncToStorage"
          @remove="syncToStorage"
          :add-class="{
            handle: 'task-sort-handle', // for fixing top position of the handle
          }"
        >
          <template #default="{ index }">
            <ObjectElement
              :name="index"
              :add-class="[
                'task-container',
                taskModel.tasks[index].type === 'Personal'
                  ? 'is-personal'
                  : 'is-business',
              ]"
            >
              <!-- Edit button, using the task name with index as label - only visible when not editable -->
              <ButtonElement
                :label="`#${index + 1} - ${taskModel.tasks[index].task}`"
                name="edit"
                align="right"
                :conditions="[['editable', '!=', index]]"
                :columns="{
                  label: 8,
                }"
                @click="edit(index)"
              >
                Edit
              </ButtonElement>
              <!-- Task input when editable -->
              <TextElement
                name="task"
                :conditions="[['editable', index]]"
                :columns="6"
              />
              <!-- Task type when editable -->
              <RadiogroupElement
                name="type"
                view="tabs"
                :conditions="[['editable', index]]"
                :columns="2"
                :items="{
                  Personal: 'P',
                  Business: 'B',
                }"
              /><!-- Cancel task editable -->
              <ButtonElement
                name="cancel"
                :conditions="[['editable', index]]"
                :columns="2"
                danger
                full
                @click="cancel"
              >
                Cancel
              </ButtonElement>
              <!-- Save task -->
              <ButtonElement
                name="save"
                :conditions="[['editable', index]]"
                :columns="2"
                full
                @click="save"
              >
                Save
              </ButtonElement></ObjectElement
            >
          </template></ListElement
        >
        <HiddenElement name="editable" />
      </Vueform>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

//the model for task
const taskModel = ref({
  tasks: [],
  editable: null,
});

//Create task and asve it in localstorage
const createTasks = (data, form$) => {
  addToLocalStorage(form$.data); // add to localstorage
  syncFromLocalStorage(); //get from localstorage
  form$.reset(); // reste form to default
};

//Add tasks to localstorage
const addToLocalStorage = (data) => {
  let dataStorage = localStorage.getItem("tasks");
  dataStorage = dataStorage ? JSON.parse(dataStorage) : [];

  dataStorage.push(data);
  localStorage.setItem("tasks", JSON.stringify(dataStorage));
};

//sync data from localstorage
const syncFromLocalStorage = () => {
  let tasks = localStorage.getItem("tasks");
  taskModel.value = {
    tasks: tasks ? JSON.parse(tasks) : [],
  };
};

//sync data to localstorage for any updates
const syncToStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(taskModel.value.tasks));
};
//edit task
const edit = (index) => {
  taskModel.value.editable = index;
};
//cancel edits
const cancel = () => {
  taskModel.value.editable = null;
};

//save dataF
const save = () => {
  syncToStorage();
  cancel();
};
// Sync the `taskModel` from localStorage upon pageload
onMounted(() => {
  syncFromLocalStorage();
});
</script>

<style lang="scss">
.task-container {
  background: #ffffff;
  padding: 1rem;

  &.is-personal {
    border-left: 3px solid green;
  }

  &.is-business {
    border-left: 3px solid purple;
  }
}

.task-wrapper {
  display: flex;
  align-items: center;
}
.vf-list-handle.task-sort-handle {
  top: 1rem;
}
</style>
