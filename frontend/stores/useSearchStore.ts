import { defineStore } from 'pinia';
export const useSearchStore = defineStore('search', {
  state: () => ({ last: [] as string[], results: [] as any[], loading: false }),
  actions: {
    async fetchLast(){
      const { lastSearch } = useApi();
      this.last = await lastSearch();
    },
    async search(q: string){
      const { search } = useApi();
      this.loading = true;
      try { this.results = await search(q); }
      finally { this.loading = false; }
    }
  }
});
