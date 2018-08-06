import { Selector } from 'testcafe';


fixture `Initial page`
   .page `http://ui`;


test('Check new-todo placeholder text and new input', async t => {
   const newToDoInput = Selector('input.new-todo');

   await t
       .expect(newToDoInput.value).eql('', 'input has no value')
       .typeText(newToDoInput, 'Buy Milk')
       .expect(newToDoInput.value).contains('Milk', 'input contains text "Milk"');
});