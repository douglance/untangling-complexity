---
theme: dracula
lineNumbers: true
highlighter: shiki
drawings:
  persist: false
transition: slide-left
title: Untangling Complexity
defaults:
  layout: two-cols
colorSchema: dark
fonts:
  sans: JetBrains Mono
  local: JetBrains Mono
  mono: JetBrains Mono

---

# Untangling Complexity 

Doug Lance
::right::

```mermaid
graph LR
  Z-->L
  Z-->I
  Z-->J
  Y-->Z
  Y-->A
  D-->Y
  K-->D
  E-->B
  K-->C
  I-->A
  L-->K
  K-->B
  J-->A
  A-->B
  B-->F
  A-->C
  A-->D
  B-->C
  C-->E
  F-->E
```

---

## Why?

To make our job easier

<!-- programming is fun. except when it isn't. -->

---

## What's the objective of this talk?

Facilitate a conversation to think about simplicity in a new way

<!-- code that is easy to understand and *easy to change* -->

---

## What are we going to talk about 

- Systems
- Organization
- Practical Applications
- Principles

---

### What is a system? 

a set of interrelated parts that achieves some objective

::right::

```mermaid
graph TD
  B[Coffee Beans]-->Grinder
  Grinder-->G[Ground Coffee]
  G-->C[Filter]
  Water-->G
  Heat-->G
  C-->|Coffee|Mug
```

---

### What is complexity? 

- **Simple**: sequential steps

```mermaid
graph LR
  A-->B
  B-->C
  C-->D
  D-->E[...]
```

::right::
<div style="margin-top:40px;"/>

- **Complex**: interconnected steps

```mermaid
graph LR
  A-->B
  B-->A
  C-->B
  A-->E
  E-->F
  E-->Y
  B-->F
  E-->Z
  Z-->A
  Z-->X[...]
  Y-->X
  F-->X
```
<!-- Our goal is to make simple systems -->
---

### What are the fundamental building blocks of a software system?

<div style="margin-left: 50px; margin-top: 50px;"/>

#### **Functions**

::right:: 

<div style="margin-left: 50px; margin-top: 150px;">
```mermaid
graph LR
  A[input]-->B[mutation]
  B-->C[output]
```
</div>
<!-- 
- it's data transforms all the way down
- data input, change to data, and data output. 
- Turing Machine.
-->

---

## Functions and Pipelines

- **Function**: a single mutation
- **Pipeline**: composition of multiple functions
::right::

```tsx
// function
function doAThing(input: number) {
  return input + 1
}

// function
function doAnotherThing(input: number) {
  return input * 2
}

// pipeline
function doThingsInOrder(input: number) {
  const a = doAThing(input)
  const b = doAnotherThing(a)
  return b
}

```

---

```mermaid
graph LR
  subgraph Complex Function
  I-->|input|A
  K-->|input|A
  J-->|input|A
  A-->B
  B-->F
  A-->C
  A-->D
  B-->E
  C-->E[A]
  D-->H
  H-->E
  F-->E
  A-->E
  E-->|output|O
  end
```

::right::

```mermaid
graph LR
  subgraph Simpler Pipeline
  I[X]-->|input|A
  A-->B
  A-->C
  A-->D
  B-->F[A]
  F-->|output|E[Y]
  C-->F
  D-->F
  end
```

---

### What Are Pure Functions?

- Always return the same output for the same input
- No side effects
  
```tsx
// pure
function sum(a: number, b: number) {
  return a + b
}
```

```mermaid
graph LR
  a-->sum
  b-->sum
  sum-->output
```

::right::

```tsx
// impure
const [stateVar1, setStateVar1] = useState(0)
const [stateVar2, setStateVar2] = useState(0)

const sum = () => {
  return stateVar1 + stateVar2
}
```

```mermaid
graph LR
  subgraph component
  stateVar1
  stateVar2
    stateVar2-->sum
    stateVar1-->sum
  subgraph a["sum() Function Scope"]
  sum
  end
    sum-->output
  end
```

---

### Testing

- Pure functions are easy to test

```tsx
function sum(a: number, b: number) {
  return a + b
}

test('sum', () => {
  expect(sum(1, 2)).toEqual(3)
})
```

- Impure functions are harder to test

```tsx
function sumAndLog(a: number, b: number) {
  const sum = a + b
  console.log(sum)
  return sum
}
test('sumAndLog', () => {
  const mockConsoleLog = jest.spyOn(console, 'log')
  expect(sumAndLog(1, 2)).toEqual(3)
  expect(mockConsoleLog).toHaveBeenCalledWith(3)
})
```

---

### Testing React

- Pure React components are easy to test

```tsx
function MyComponent({ name }: { name: string }) {
  return <div>Hello, {name}</div>
}
test('MyComponent', async () => {
  expect(render(<MyComponent name="World" />)).toMatchSnapshot()
})
```

:: right::

- Impure React components are harder to test

```tsx {all} {maxHeight:'400px'}
function MyComponent({ name }: { name: string }) {
  const [count, setCount] = useState(0);

  const handleClick = async () => {
    setCount((prevCount) => prevCount + 1);
    await writeToDatabase(name, count + 1);
  }

  return <div onClick={handleClick}>Hello, {name}! You have clicked {count} times.</div>;
}

test('MyComponent', async () => {
  const writeToDatabaseMock = jest.spyOn(MyComponent, 'writeToDatabase');
  writeToDatabaseMock.mockImplementation(() => Promise.resolve());

  const { getByText, container } = render(<MyComponent name="World" />)
  const divElement = getByText(/Hello, World! You have clicked 0 times./i);

  fireEvent.click(divElement);
  await new Promise(r => setTimeout(r, 1000));

  expect(container.innerHTML).toMatch('Hello, World! You have clicked 1 times.');
  expect(writeToDatabaseMock).toHaveBeenCalledWith('World', 1);

  writeToDatabaseMock.mockRestore();
})

```

---

### Pure *Pipelines* Are Easy To Test

```tsx
export function toUpperCase(input: string): string {
  return input.toUpperCase();
}

export function removeSpaces(input: string): string {
  return input.replace(/\s+/g, '');
}

export function reverse(input: string): string {
  return input.split('').reverse().join('');
}

export function purePipeline(input: string): string {
  return reverse(removeSpaces(toUpperCase(input)));
}
```

::right::

<div style="height: 72px"/>
<div style="padding-left: 10px">

```tsx {all} {marginLeft:'400px'}
test('toUpperCase', () => {
  expect(toUpperCase('hello world')).toBe('HELLO WORLD');
});

test('removeSpaces', () => {
  expect(removeSpaces('h e l l o')).toBe('hello');
});

test('reverse', () => {
  expect(reverse('hello')).toBe('olleh');
});

test('purePipeline', () => {
  expect(purePipeline('Hello World')).toBe('DLROWOLLEH');
});

```
<!-- That's an integration test -->
</div>

---

### Going too far with pure functions

- Can become a bigger mess
- Can create duplication
- It's **impossible** to avoid:
  - impure functions
  - side effects
  - implicit inputs
  - complexity
- But it can be *encapsulated*
  
::right::

```ts {maxHeight: "800px"}
// dataModule.ts
async function fetchData(url: string) {
    const response = await axios.get(url);
    return response.data;
}

function pipelineData(data: any) {
    // ${insert complex logic here}
    return data.map((item: any) => item * 2);
}

async function saveData(url: string, data: any) {
    const response = await axios.post(url, data);
    return response.data;
}

export function dataModule(url: string) {
    return {
        async getData() {
            const data = await fetchData(url);
            return pipelineData(data);
        },
        async saveData(data: any) {
            return saveData(url, data);
        }
    }
}

```

---

## Encapsulation

- Functions organized into modules are easier to understand
- Try to keep the call site simple by pushing complexity down the stack

:: right::

```mermaid
graph TD
    subgraph Call Site
        A[A]
    end
    subgraph Module 2
        A --> B[B]
        A --> C[C]
    end
    subgraph Module 3
        B --> D[D]
        B --> E[E]
        C --> F[F]
        C --> G[G]
    end
    subgraph Module 4
        D --> H[H]
        D --> I[I]
        E --> J[J]
        E --> K[K]
        F --> L[L]
        F --> M[M]
        G --> N[N]
        G --> O[O]
    end
```

---

### Modules

- Collections of functions that work together *exclusively*

::right::

```ts {maxHeight: "800px"}
// dataModule.ts
async function fetchData(url: string) {
    const response = await axios.get(url);
    return response.data;
}

function processData(data: any) {
    // ${insert complex logic here}
    return data.map((item: any) => item * 2);
}

async function saveData(url: string, data: any) {
    const response = await axios.post(url, data);
    return response.data;
}

export function dataModule(url: string) {
    return {
        async getData() {
            const data = await fetchData(url);
            return processData(data);
        },
        async saveData(data: any) {
            return saveData(url, data);
        }
    }
}

```

---

### Error Handling

- Error handling is easier when you encapsulate your logic into modules
- Handle the lower level errors in the module above
  - **A** handles errors for **Module 2** functions
  - **B** and **C** handles errors for **Module 3** and **Module 4** functions
  
::right::

```mermaid
graph LR
    subgraph 1[Call Site]
        A[A]
    end
    subgraph 2[Module 2]
        A --> B[B]
        A --> C[C]
    end
    subgraph 3[Module 3]
        B --> D[D]
        C --> F[F]
    end
    subgraph 4[Module 4]
        B --> E[E]
        C --> G[G]
    end
```

---

```ts
// module4.ts
export const functionE = () => {
  throw new Error('Error from Function E in Module 4');
};

export const functionG = () => {
  throw new Error('Error from Function G in Module 4');
};
```

```ts
// module3.ts
import { functionE, functionG } from './module4';

export const functionD = () => {
  try {
    functionE();
  } catch (error) {
    throw new Error('Error from Function D in Module 3');
  }
};

export const functionF = () => {
  try {
    functionG();
  } catch (error) {
    throw new Error('Error from Function F in Module 3');
  }
};
```

::right::

```ts
// module2.ts
export const functionB = () => {
  try {
    functionD();
  } catch (error) {
    throw new Error('Error from Function B in Module 2');
  }
};
export const functionC = () => {
  try {
    functionF();
  } catch (error) {
    throw new Error('Error from Function C in Module 2');
  }
};
```

```ts
// callSite.ts
export const functionA = () => {
  try {
    functionB();
    functionC();
  } catch (error) {
    console.log('Error handled in Function A:', error);
  }
};
```

---

```ts
// api.ts
export const fetchUserData = (userId: string) => {
  return fetch(`https://api.example.com/users/${userId}`).then(response =>
    response.json()
  );
};
export const fetchUserPosts = (userId: string, postIds: string[]) => {
  return fetch(`https://api.example.com/users/${userId}/posts/`, {
    postIds,
  }).then((response) => response.json());
};
```

```ts
// userService.ts
import { fetchUserData, fetchUserPosts } from './api';

export const getUserData = (userId: string) => {
  return fetchUserData(userId).catch(error => {
    throw new Error(`Failed to fetch user data: ${error.message}`);
  });
};

export const getUserPosts = (userId: string, postIds: string[]) => {
  return fetchUserPosts(userId, postIds).catch(error => {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  });
};
```

::right::

```ts
// dashboardService.ts
import { getUserData, getUserPosts } from './userService';

export const getDashboardData = (userId: string) => {
  try{
    return getUserData(userId)
      .then(userData => {
        return getUserPosts(userId, userData.postIds)
          .then(userPosts => {
            return { userData, userPosts };
          });
      })
  }
  catch(error){
    throw new Error(`Failed to fetch dashboard data: ${error.message}`);
  };
};
```

```ts
// app.ts
getDashboardData('1')
  .then(data => console.log(data))
  .catch(error => console.error(`Error in app: ${error.message}`));
```

---

## Debugging is easier

- Simple, modular functions are easier to debug

***Examples***

---

## What does this look like in practice?

<!-- Bonus: Callstack is easier to understand -->

---

### Disorganized Function

```ts 
function spaghettiFunction(input1, input2, input3) {
  let x = input1 + input2
  x = x * scopedVar
  let y = input2 - input3
  y = y > 0 ? y : 0
  let z = y % 2 === 0
  return [x, y, z]
}
```

::right::

```mermaid
graph LR
scopedVar[scopedVar]-->f
input1
input2
input3
    input1-->f[x]
    input2-->f
    input2-->y
    input3-->y
  subgraph spaghettiFunction
    f-->+
    +-->f
    f-->*
    y-->-
    --->y
    y-->?
    ?-->y
    y-->z
  end
    z-->output
    f-->output
    y-->output
    *-->scopedVar
```

---

### Organized Pipeline

```ts 
type MaintainablePipelineInput = {
  input1: number
  input2: number
  input3: number
  input4: number
}
function sum(a: number, b: number) {
  return a + b
}
function multiply(a: number, b: number) {
 return a * b;
}
function subtractOrZero(a: number, b: number) {
 let difference = a - b;
 return difference > 0 ? difference : 0;
}
function isEven(n: number) {
 return n % 2 === 0;
}
function maintainablePipeline({ input1, input2, input3, input4 }: MaintainablePipelineInput) {
 let x = multiply(sum(input1, input2), input4);
 let y = subtractOrZero(input2, input3);
 let z = isEven(input3);
 return [x, y, z];
}
```

::right::

```mermaid
graph LR
subgraph args
  input1
  input2
  input3
  input4
end

subgraph maintainablePipeline
  input1-->sum
  input2-->sum
  sum-->multiply
  input4-->multiply

  input2-->subtractOrZero
  input3-->subtractOrZero

  input3-->isEven
end
  multiply-->output
  subtractOrZero-->output
  isEven-->output
```
<!-- we're using the type system to validate inputs, mutating state by assigning variables, using syntax to transform into an array for output, then returning that data -->

---

### React

- Components have a single *explicit* input (props)
- **But** imports, hooks, and context are *implicit* inputs
- Everything in scope (other than props) is an *implicit* input
- Hooks can be an *implicit* ***output*** also

::right::

```mermaid
graph LR
  H[useHook]
  subgraph Context.Provider
    A[ComponentA]
    A-->|props|B[ComponentB]
    B-->|props|C[ComponentC]
    A-->|props|D[ComponentD]
    H<-->|input/output|A
    H<-->|input/output|D
    H<-->|input/output|C
    H<-->|input/output|B
  end
  H-->Context.Provider
```

---

### HTML / CSS

```html
<div class="flex-container">
  <div class="flex-item">Item 1</div>
  <div class="flex-item" id="special-item">Item 2</div>
  <div class="flex-item">Item 3</div>
</div>
```

```css
body {
    background-color: lavender;
}
.flex-container {
    display: flex;
    justify-content: space-between;
}
.flex-item {
    border: 2px solid navy;
    padding: 20px;
}
.flex-item:nth-child(2n) {
    background-color: powderblue;
}
#special-item {
    color: white;
    background-color: slategray;
}
```

::right::

```mermaid
graph LR
  B[.body]-->|"background-color: lavender"|body(body)
  CSS[style.css]-->B
  CSS-->F
  CSS-->FI
  CSS-->SI
  CSS-->FI2
  defaultStylesForBody[".default browser styles for body"]-->|"font-size: 16px<br>font-family: Times New Roman<br>margin: 8px"|body
  body-->div1
  body-->div2
  body-->div3
  F[".flex-container"]-->|"display: flex<br>justify-content: space-between"|div1["(div) flex-item"]
  defaultStylesForDiv[".default browser styles for div"]-->|"display: block"|div1
  FI[".flex-item"]-->|"border: 2px solid navy<br>padding: 20px"|div1
  F-->|"display: flex<br>justify-content: space-between"|div2["(div) flex-item, special-item"]
  defaultStylesForDiv-->|"display: block"|div2
  FI-->|"border: 2px solid navy<br>padding: 20px"|div2
  SI["#special-item"]-->|"color: white<br>background-color: slategray"|div2
  FI2[".flex-item:nth-child(2n)"]-->|"background-color: powderblue"|div2
  F-->|"display: flex<br>justify-content: space-between"|div3["(div) flex-item"]
  defaultStylesForDiv-->|"display: block"|div3
  FI-->|"border: 2px solid navy<br>padding: 20px"|div3
  style defaultStylesForBody fill:#800000,stroke:#333,stroke-width:2px
  style defaultStylesForDiv fill:#800000,stroke:#333,stroke-width:2px
```

---

### Tailwind

- Fewer implicit inputs
- WYSIWYG
- Less global CSS acting on your elements

```tsx
<div className="flex flex-col w-full h-full">
  <h1 className="font-bold">First Line</p>
  <h3 className="text-slate-500">Second Line</p>
  <p className="hidden">Third Line</p>
</div>
```

:: right::
  
```mermaid
graph LR
t[tailwind]-->|flex|div
t-->|flex-col|div
t-->|w-full|div
t-->|h-full|div
t-->|font-bold|h1
t-->|text-slate-500|h3
t-->|hidden|p
div-->h1
div-->h3
div-->p
```

---

## How do we pipeline data

1. Validate input data
1. Mutate the data
1. Transform response for output
1. Output data

::right::

```mermaid
graph TD
  A[ ]-->|input|B[validate]
  B-->D[mutate]
  D-->E[transform]
  E-->|output|F[ ]
```

<!-- 
- some of these steps are implied or assumed to have been done outside of a function or using the type system, but they're happening still 
- the platonic ideal of a pipeline is a non-branching pipeline
- each step is a function that takes an input and returns a single output -->
  
---

## Principles

- **Simple** is better than **complex**
- Minimize the number of inputs *(explicit and implicit)*
- Use serial pure functions create pure pipelines
- Encapsulate impure functions in modules
