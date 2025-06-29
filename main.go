package main

import (
	"fmt"
)

//TIP <p>To run your code, right-click the code and select <b>Run</b>.</p> <p>Alternatively, click
// the <icon src="AllIcons.Actions.Execute"/> icon in the gutter and select the <b>Run</b> menu item from here.</p>

func main() {
	//TIP <p>Press <shortcut actionId="ShowIntentionActions"/> when your caret is at the underlined text
	// to see how GoLand suggests fixing the warning.</p><p>Alternatively, if available, click the lightbulb to view possible fixes.</p>
	s := "gopher"
	fmt.Printf("Hello and welcome, %s!\n", s)

	for i := 1; i <= 5; i++ {
		//TIP <p>To start your debugging session, right-click your code in the editor and select the Debug option.</p> <p>We have set one <icon src="AllIcons.Debugger.Db_set_breakpoint"/> breakpoint
		// for you, but you can always add more by pressing <shortcut actionId="ToggleLineBreakpoint"/>.</p>
		fmt.Println("i =", 100/i)
	}

}

// Types i might need.
type Terrain struct {
	location   [2]int
	kind       TerrainKind
	diceNumber int
	tradeKind  TerrainKind
}

type Road struct {
	location [3]int
	player   int
}

type VerticesPiece struct {
	kind     PieceKind
	location [3]int
	player   int
}

type TerrainKind int

const (
	Lumber TerrainKind = iota
	Brick
	Wool
	Grain
	Ore
	Dessert
	Port
	Sea
	Resource
)

type PieceKind int

const (
	Settlement PieceKind = iota
	City
)

type Board struct {
	terrain []Terrain
	roads   []Road
	pieces  []VerticesPiece
	thief   [2]int
}
