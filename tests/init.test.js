import { Selector } from 'testcafe';


fixture `Initial page`
   .page `localhost`;


test('Check new-todo placeholder text and new input', async t => {
   const newToDoInput = Selector('input.new-todo');
   const addedToDo = Selector('.todo-list li label')

   await t
       .expect(newToDoInput.value).eql('', 'input has no value')
});
